import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../models/Product";

// Products data seeded directly from public/products.json
const products = [
  { id: 0,  img: "img/product/0.png",  name: "SAMSUNG 55 Inch UHD 4K Smart TV With Receiver",        price: 350, catetory: "electronics", featured: true  },
  { id: 1,  img: "img/product/1.png",  name: "Redmi 13C Dual SIM with 6GB RAM",                       price: 280, catetory: "mobiles",     featured: false },
  { id: 2,  img: "img/product/2.png",  name: "Dell Laptop Latitude 5530 Core i7-1255U 8GB SSD",       price: 400, catetory: "electronics", featured: true  },
  { id: 3,  img: "img/product/3.png",  name: "Canon EOS RP Mirrorless Camera",                        price: 530, catetory: "electronics", featured: true  },
  { id: 4,  img: "img/product/4.png",  name: "OPPO A18 128GB 4GB Glowing Black",                      price: 250, catetory: "mobiles",     featured: false },
  { id: 5,  img: "img/product/5.png",  name: "Samsung 27-Inch G55C Odyssey QHD 4k",                   price: 280, catetory: "electronics", featured: false },
  { id: 6,  img: "img/product/6.png",  name: "Infinix Smart (Galaxy White, 4GB RAM, 64GB Storage)",   price: 220, old_price: 300, catetory: "mobiles",     featured: false },
  { id: 7,  img: "img/product/7.png",  name: "HP Victus Gaming Laptop 8RAM SSD",                      price: 370, catetory: "electronics", featured: true  },
  { id: 8,  img: "img/product/8.png",  name: "Xiaomi Redmi 13C Dual SIM 8GB",                         price: 320, catetory: "mobiles",     featured: false },
  { id: 9,  img: "img/product/9.png",  name: "Handheld Barcode Scanner 1D/2D/QR Code",                price: 80,  old_price: 100, catetory: "electronics", featured: false },
  { id: 10, img: "img/product/10.png", name: "Large Venue building mapping Projector",                 price: 300, catetory: "electronics", featured: false },
  { id: 11, img: "img/product/11.png", name: "Infinix Hot 40i (RAM: 4+4GB, 128GB)",                   price: 260, old_price: 300, catetory: "mobiles",     featured: false },
  { id: 12, img: "img/product/12.png", name: "HP DeskJet 2710 Printer, All-in-One",                   price: 370, catetory: "electronics", featured: false },
  { id: 13, img: "img/product/13.png", name: "Fuzzy Logic Rice Cooker DIGITAL-JAR 1.8L 940W",         price: 490, catetory: "appliances",  featured: false },
  { id: 14, img: "img/product/14.png", name: "Sencor STS 5070SS Electric Toaster for Four Slices",    price: 340, catetory: "appliances",  featured: false },
  { id: 15, img: "img/product/15.png", name: "Infinix Smart 6 Plus (Miracle Black)",                  price: 240, old_price: 300, catetory: "mobiles",     featured: false },
  { id: 16, img: "img/product/16.png", name: "Washing Machine 959 Series 8kg Senator Aqua SX",        price: 600, old_price: 700, catetory: "appliances",  featured: true  },
  { id: 17, img: "img/product/17.png", name: "HIKVISION PTZ Camera 4K Outdoor",                       price: 185, catetory: "electronics", featured: false },
  { id: 18, img: "img/product/18.png", name: "OPPO Reno11 5G 256GB 12GB",                             price: 225, catetory: "mobiles",     featured: false },
  { id: 19, img: "img/product/19.png", name: "VIVAX kettle WH-175L 1.7L capacity",                    price: 140, catetory: "appliances",  featured: false },
  { id: 20, img: "img/product/20.png", name: "Kenstar Ester ABS Plastic 750W Mixer Grinder",          price: 280, old_price: 330, catetory: "appliances",  featured: false },
  { id: 21, img: "img/product/21.png", name: "Multifunctional Food Processor",                        price: 350, catetory: "appliances",  featured: false },
  { id: 22, img: "img/product/22.png", name: "Zanussi Washing Machine 8 Kg 1200 RPM",                 price: 580, catetory: "appliances",  featured: false },
  { id: 23, img: "img/product/23.png", name: "Sharp 42 Lt Electronic Oven Convection",                price: 400, catetory: "appliances",  featured: false },
  { id: 24, img: "img/product/24.png", name: "Lenovo Monitor Legion R27fc-30 Gaming Curved",          price: 300, old_price: 380, catetory: "electronics", featured: true  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in .env before seeding.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
