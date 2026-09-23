import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function POST(req) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    const options = {
      amount: amount * 100, // Razorpay amount is in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    // For demo purposes, if keys are dummy, we mock the response
    if (process.env.RAZORPAY_KEY_ID === undefined) {
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        mocked: true
      });
    }

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
