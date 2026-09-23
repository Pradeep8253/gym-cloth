import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    if (user.resetPasswordOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
