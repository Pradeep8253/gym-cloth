import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all orders and populate user data
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
