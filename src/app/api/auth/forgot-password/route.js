import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connectDB';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: 'If an account with that email exists, an OTP has been sent.' }, { status: 200 });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // OTP expires in 10 minutes
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_MAIL,
      to: user.email,
      subject: 'Password Reset OTP - VOLT ATHLETICS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #050505; text-transform: uppercase;">Reset Your Password</h2>
          <p>You requested a password reset for your VOLT ATHLETICS account.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="background-color: #f5f5f2; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
