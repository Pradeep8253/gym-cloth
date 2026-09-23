import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const sport = searchParams.get('sport');

    const query = { isDeleted: { $ne: true } };
    if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (gender) query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    if (sport) query.sport = { $regex: new RegExp(`^${sport}$`, 'i') };

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    
    // Auto-generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
}
