import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState(null);

  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // حالات تسجيل الدخول
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    fetchProducts();
  }, []);

  // مراقبة التمرير لإظهار الزر
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // حفظ السلة في LocalStorage عند كل تغيير
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) { 
      console.error(err);
      toast.error("فشل الاتصال بالسيرفر لجلب المنتجات");
    }
    finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      toast.success("تم تسجيل الدخول بنجاح");
    } else { toast.error(data.message); }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    toast.info("تم تسجيل الخروج");
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    // نمرر للأعلى لبدء التعديل في النموذج
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) formData.append('image', image);

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (res.status === 401) {
      logout();
      return;
    }

    if (res.ok) {
      setName('');
      setPrice('');
      setImage(null);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProducts(); // تحديث القائمة
      toast.success(editingId ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح");
    } else {
      toast.error(editingId ? "فشل في تحديث المنتج" : "فشل في إضافة المنتج");
    }
  };

  const deleteProduct = async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      logout();
      return;
    }

    if (res.ok) {
      fetchProducts();
      toast.warn("تم حذف المنتج");
    }
  };

  const rateProduct = async (id, stars) => {
    try {
      const res = await fetch(`/api/products/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: stars }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchProducts();
      } else { toast.error(data.message); }
    } catch (err) { toast.error("حدث خطأ أثناء التقييم"); }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setImage(null);
  };

  // وظيفة العودة للأعلى
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // تصفية المنتجات بناءً على نص البحث
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="nav-container">
          <div className="logo">
            <h1>متجرنا <span>Fullstack</span></h1>
          </div>
          
          <nav className={`nav-links-wrapper ${menuOpen ? 'active' : ''}`}>
            <ul className="nav-list" onClick={() => setMenuOpen(false)}>
              <li><a href="/">الرئيسية</a></li>
              <li><a href="#products">المنتجات</a></li>
              <li><a href="#about">من نحن</a></li>
              <li><a href="#contact">اتصل بنا</a></li>
              {token && <li className="mobile-only"><button onClick={logout} className="logout-link">خروج</button></li>}
            </ul>
          </nav>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <i className="fa fa-sun"></i> : <i className="fa fa-moon"></i>}
            </button>
            <button className="cart-toggle" onClick={() => setIsCartOpen(true)}>
              <i className="fa fa-shopping-cart"></i>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
              )}
            </button>
            {token && <button onClick={logout} className="logout-btn-nav desktop-only">تسجيل خروج</button>}
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <i className={`fa ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="header-intro">
          <h2>{editingId ? "تعديل المنتج" : "إدارة المنتجات"}</h2>
          <p>إدارة المخزون والأسعار بشكل حي</p>
        </div>
      
      {/* أدوات المدير: تظهر فقط عند تسجيل الدخول */}
      {token && (
        <div className="admin-section">
          <div className="admin-top-bar">
            <button onClick={logout} className="logout-btn">خروج الإدارة</button>
            <button onClick={seedData} className="seed-btn btn">توليد منتجات Unsplash 🚀</button>
          </div>
          <form onSubmit={addProduct} className="add-form">
            <input 
              placeholder="أدخل اسم المنتج..." 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="السعر (ج.م)" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
            />
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])} 
            />
            <button type="submit" className="btn">{editingId ? "حفظ التغييرات" : "إضافة منتج جديد"}</button>
            {editingId && <button type="button" onClick={cancelEdit} className="cancel-btn">إلغاء</button>}
          </form>
        </div>
      )}

      {/* نموذج الدخول: يظهر فقط إذا لم يكن هناك توكن (اختياري، يمكن وضعه في صفحة منفصلة) */}
      {!token && (
        <div className="guest-info">
          <p>أهلاً بك في متجرنا! تصفح منتجاتنا أدناه.</p>
        </div>
      )}

      <div className="search-box">
        <input 
          type="text" 
          placeholder="ابحث عن منتجك المفضل..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="product-list">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="product-list" id="products">
          {filteredProducts.length === 0 ? <p>لا توجد منتجات متوفرة حالياً.</p> : null}
          {filteredProducts.map((p) => (
            <div key={p._id} className="product-card">
              {p.image && (
                <img 
                  src={p.image.startsWith('http') ? p.image : `/${p.image}`} 
                  alt={p.name} 
                  className="product-img" 
                  loading="lazy" 
                />
              )}
              <div className="info">
                <h3>{p.name}</h3>
                <p className="price-val">السعر: <span>{p.price}</span> ج.م</p>
                
                <div className="rating-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`fa-star ${star <= Math.round(p.rating) ? 'fas' : 'far'}`}
                      onClick={() => rateProduct(p._id, star)}
                      style={{ cursor: 'pointer', color: star <= Math.round(p.rating) ? '#ffc107' : '#ccc' }}
                    ></i>
                  ))}
                  <span className="reviews-count">({p.numReviews})</span>
                </div>
                <button className="add-to-cart-btn btn" onClick={() => addToCart(p)}>
                  <i className="fa fa-cart-plus"></i> إضافة للسلة
                </button>
              </div>
              {/* زر الحذف يظهر للمدير فقط */}
              {token && (
                <button className="delete-btn" onClick={() => deleteProduct(p._id)}>
                  <i className="fa fa-trash"></i> حذف المنتج
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      </div>

      {/* سلة المشتريات Side Drawer */}
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-drawer ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h3>سلة المشتريات</h3>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}><i className="fa fa-times"></i></button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? <p className="empty-msg">السلة فارغة حالياً</p> : cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image.startsWith('http') ? item.image : `/${item.image}`} alt={item.name} />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>{item.price} ج.م</p>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>
              </div>
              <button className="remove-item" onClick={() => removeFromCart(item._id)}><i className="fa fa-trash"></i></button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total">الإجمالي: <span>{cartTotal}</span> ج.م</div>
            <button className="checkout-btn btn">إتمام الطلب</button>
          </div>
        )}
      </div>

      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} title="العودة للأعلى">
          <i className="fa fa-arrow-up"></i>
        </button>
      )}
      <ToastContainer position="top-center" rtl pauseOnFocusLoss={false} />
    </div>
  );
}

export default App;
