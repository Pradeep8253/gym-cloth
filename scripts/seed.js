import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  resetPasswordOtp: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: null },
  category: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Men', 'Women', 'Unisex'] },
  sport: { type: String, required: true },
  badge: { type: String, default: null },
  image: { type: String, required: true },
  colors: { type: [String], default: [] },
  description: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const dummyProducts = [
  {
    name: "Men Gym T-Shirt",
    slug: "men-gym-tshirt",
    price: 1500,
    salePrice: 1299,
    category: "T-Shirts",
    gender: "Men",
    sport: "Gym",
    badge: "NEW",
    image: "/images/products/tshirt.jpg",
    colors: ["#000", "#fff", "#333"],
    description: "High-performance gym t-shirt designed for maximum breathability."
  },
  {
    name: "Women Running Shorts",
    slug: "women-running-shorts",
    price: 1200,
    salePrice: null,
    category: "Shorts",
    gender: "Women",
    sport: "Running",
    badge: "BESTSELLER",
    image: "/images/products/tshirt.jpg",
    colors: ["#000", "#ff0000"],
    description: "Lightweight running shorts with inner lining."
  },
  {
    name: "Unisex Football Hoodie",
    slug: "unisex-football-hoodie",
    price: 3500,
    salePrice: null,
    category: "Hoodies",
    gender: "Unisex",
    sport: "Football",
    badge: null,
    image: "/images/products/tshirt.jpg",
    colors: ["#111", "#444"],
    description: "Warm hoodie perfect for cold weather training."
  },
  {
    name: "Men Basketball Joggers",
    slug: "men-basketball-joggers",
    price: 2500,
    salePrice: 1999,
    category: "Joggers",
    gender: "Men",
    sport: "Basketball",
    badge: "SALE",
    image: "/images/products/tshirt.jpg",
    colors: ["#000"],
    description: "Flexible joggers for on and off the court."
  },
  {
    name: "Women Tennis Accessories",
    slug: "women-tennis-accessories",
    price: 800,
    salePrice: null,
    category: "Accessories",
    gender: "Women",
    sport: "Tennis",
    badge: null,
    image: "/images/products/tshirt.jpg",
    colors: ["#fff", "#f0f0f0"],
    description: "Essential tennis accessories for your match."
  },
  {
    name: "Pro Training T-Shirt",
    slug: "pro-training-tshirt",
    price: 1800,
    salePrice: null,
    category: "T-Shirts",
    gender: "Men",
    sport: "Gym",
    badge: "PRO",
    image: "/images/products/tshirt.jpg",
    colors: ["#222", "#000"],
    description: "Professional grade training apparel."
  }
];

async function seed() {
  try {
    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB_NAME || 'gym-cloth',
    };

    console.log('Connecting to MongoDB...', MONGODB_URI.split('@')[1] || MONGODB_URI);
    await mongoose.connect(MONGODB_URI, opts);
    console.log('Connected to Database:', process.env.MONGODB_DB_NAME || 'gym-cloth');

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('Seeding users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@volt.com',
        password: hashedAdminPassword,
        role: 'ADMIN'
      },
      {
        name: 'Test User',
        email: 'user@volt.com',
        password: hashedUserPassword,
        role: 'USER'
      }
    ]);

    console.log('Seeding products...');
    await Product.create(dummyProducts);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
