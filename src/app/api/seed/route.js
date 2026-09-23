import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import User from '@/models/User';
import Product from '@/models/Product';
import bcrypt from 'bcrypt';

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
    image: "/images/products/tshirt.jpg", // Using placeholder image
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

export async function GET() {
  try {
    await connectDB();

    // 1. Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // 2. Seed Users
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

    // 3. Seed Products
    await Product.create(dummyProducts);

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      users: {
        admin: 'admin@volt.com / admin123',
        user: 'user@volt.com / user123'
      },
      productsCount: dummyProducts.length
    }, { status: 200 });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ message: 'Error seeding database', error: error.message }, { status: 500 });
  }
}
