import React from 'react';
import CheckoutClient from '@/components/checkout/CheckoutClient';
import Script from 'next/script';

export const metadata = {
  title: 'Checkout | VOLT ATHLETICS',
};

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <CheckoutClient />
    </>
  );
}
