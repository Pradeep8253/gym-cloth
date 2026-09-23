import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import User from '@/models/User';
import { auth } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Fetch all users, excluding passwords
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
