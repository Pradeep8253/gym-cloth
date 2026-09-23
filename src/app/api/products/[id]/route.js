import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    // Assuming params.id is actually the slug based on how we fetch single product
    const { id: slug } = await params;
    
    const product = await Product.findOne({ slug, isDeleted: { $ne: true } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const data = await request.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    
    // Soft delete
    const deletedProduct = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
