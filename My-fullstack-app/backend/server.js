require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// تهيئة Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const SECRET_KEY = process.env.JWT_SECRET;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

// جعل مجلد الرفع متاحاً للوصول العام لعرض الصور
// إضافة التخزين المؤقت (Caching) لمدة يوم واحد لتحسين السرعة
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '1d' }));

// إعداد تقديم ملفات React في الإنتاج
if (process.env.NODE_ENV === 'production') {
    // تحديد مجلد الـ Build الخاص بـ Vite
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));

    // أي مسار لا يبدأ بـ /api يتم توجيهه إلى index.html الخاص بـ React
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// التأكد من وجود مجلد uploads (لا يعمل على Vercel)
try {
    if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
    }
} catch (e) {}

// إعداد Multer لتخزين الملفات
// سنستخدم MemoryStorage بدلاً من DiskStorage لمعالجتها قبل الحفظ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// الاتصال بقاعدة بيانات MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ تم الاتصال بـ MongoDB بنجاح!'))
    .catch((err) => console.error('❌ فشل الاتصال بـ MongoDB:', err));

// تعريف هيكل المنتج (Schema)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 }, // متوسط التقييم
    numReviews: { type: Number, default: 0 }, // عدد الأشخاص الذين قيموا
    image: { type: String }, // مسار الصورة
    imagePublicId: { type: String }, // معرف الصورة في Cloudinary للحذف
    createdAt: { type: Date, default: Date.now }
});

// إنشاء النموذج (Model)
const Product = mongoose.model('Product', productSchema);

// تعريف مستخدم (User)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Middleware للتحقق من التوكن (حماية المسارات)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "يرجى تسجيل الدخول أولاً" });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "جلسة غير صالحة، يرجى إعادة تسجيل الدخول" });
    }
};

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); 
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات" });
    }
});

// إضافة منتج جديد
app.post('/api/products', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const price = Number(req.body.price);
        if (!req.body.name || isNaN(price) || price <= 0) {
            return res.status(400).json({ message: "الاسم والسعر مطلوبان" });
        }

        let imageData = { url: '', publicId: '' };
        if (req.file) {
            // الرفع إلى Cloudinary باستخدام Stream
            const result = await new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { folder: "ecommerce_products" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            imageData.url = result.secure_url;
            imageData.publicId = result.public_id;
        }

        const newProduct = new Product({
            name: req.body.name,
            price: price,
            image: imageData.url,
            imagePublicId: imageData.publicId
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: "خطأ في إضافة المنتج" });
    }
});

// حذف منتج
app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });

        // حذف الصورة من Cloudinary
        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "تم حذف المنتج والصورة بنجاح" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "حدث خطأ أثناء عملية الحذف" });
    }
});

// تحديث منتج موجود
app.put('/api/products/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });

        const updateData = {
            name: name || product.name,
            price: price ? Number(price) : product.price
        };

        if (req.file) {
            // حذف الصورة القديمة من Cloudinary
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }

            const result = await new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { folder: "ecommerce_products" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
            updateData.image = result.secure_url;
            updateData.imagePublicId = result.public_id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء تحديث المنتج" });
    }
});

// إضافة تقييم لمنتج (متاح للجميع)
app.post('/api/products/:id/rate', async (req, res) => {
    try {
        const { rating } = req.body;
        const numericRating = Number(rating);

        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "التقييم يجب أن يكون بين 1 و 5" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });

        // حساب المتوسط الجديد: (المتوسط القديم * عدد التقييمات + التقييم الجديد) / (العدد الكلي الجديد)
        product.rating = (product.rating * product.numReviews + numericRating) / (product.numReviews + 1);
        product.numReviews += 1;

        await product.save();
        res.json({ message: "تم إضافة تقييمك بنجاح", rating: product.rating, numReviews: product.numReviews });
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء إضافة التقييم" });
    }
});

// مسار لملء قاعدة البيانات بمنتجات حقيقية من Unsplash
app.post('/api/seed', verifyToken, async (req, res) => {
    try {
        const seedProducts = [
            { 
                name: "iPhone 15 Pro Max", 
                price: 65000, 
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800", 
                rating: 5, numReviews: 128 
            },
            { 
                name: "Samsung Galaxy S23 Ultra", 
                price: 52000, 
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800", 
                rating: 4, numReviews: 95 
            },
            { 
                name: "MacBook Pro M3", 
                price: 98000, 
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800", 
                rating: 5, numReviews: 42 
            },
            { 
                name: "ثلاجة LG InstaView ذكية", 
                price: 45000, 
                image: "https://images.unsplash.com/photo-1571175432230-01c2462ad9a1?q=80&w=800", 
                rating: 4, numReviews: 34 
            },
            { 
                name: "ماكينة قهوة Espresso احترافية", 
                price: 15500, 
                image: "https://images.unsplash.com/photo-1517668808822-9eaa02f2a8b1?q=80&w=800", 
                rating: 5, numReviews: 67 
            }
        ];

        await Product.deleteMany({}); // حذف المنتجات القديمة
        const createdProducts = await Product.insertMany(seedProducts);
        res.json({ message: "تم ملء قاعدة البيانات بمنتجات Unsplash بنجاح!", count: createdProducts.length });
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء ملء البيانات" });
    }
});

// مسار تسجيل الدخول (Login)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
    }
});

// مسار تسجيل مستخدم جديد (Register)
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "جميع الحقول مطلوبة" });

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ message: "هذا البريد الإلكتروني مستخدم بالفعل" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
        res.json({ token, user: { name: user.name, email: user.email }, message: "تم إنشاء الحساب بنجاح" });
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء التسجيل" });
    }
});

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 السيرفر يعمل على المنفذ: ${PORT}`);
    });
}

module.exports = app;