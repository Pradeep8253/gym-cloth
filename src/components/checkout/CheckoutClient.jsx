"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useStore from '@/lib/store/useStore';
import styles from './CheckoutClient.module.css';

const CheckoutClient = () => {
  const router = useRouter();
  const { cartItems, getCartTotal } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);

    try {
      // 1. Create order API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      
      const order = await res.json();
      
      if (order.mocked) {
        // Handle mock flow
        setTimeout(() => {
          alert('Mock Payment Successful!');
          useStore.setState({ cartItems: [], isCartOpen: false });
          router.push('/');
        }, 1000);
        return;
      }

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy',
        amount: order.amount,
        currency: order.currency,
        name: 'VOLT ATHLETICS',
        description: 'Premium Sportswear Purchase',
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment
          const verifyRes = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('Payment Successful!');
            useStore.setState({ cartItems: [], isCartOpen: false });
            router.push('/');
          } else {
            alert('Payment verification failed.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#000000',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Your bag is empty</h2>
        <button onClick={() => router.push('/shop')} className={styles.btn}>Return to Shop</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* Left: Checkout Form */}
        <div className={styles.formSection}>
          <h1 className="h3">Checkout</h1>
          
          <form id="checkout-form" onSubmit={handleCheckout} className={styles.form}>
            <div className={styles.formGroup}>
              <h2 className="h5">Contact Information</h2>
              <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className={styles.input} />
            </div>
            
            <div className={styles.formGroup}>
              <h2 className="h5">Shipping Address</h2>
              <div className={styles.row}>
                <input type="text" name="firstName" placeholder="First name" required onChange={handleInputChange} className={styles.input} />
                <input type="text" name="lastName" placeholder="Last name" required onChange={handleInputChange} className={styles.input} />
              </div>
              <input type="text" name="address" placeholder="Address" required onChange={handleInputChange} className={styles.input} />
              <div className={styles.row}>
                <input type="text" name="city" placeholder="City" required onChange={handleInputChange} className={styles.input} />
                <input type="text" name="state" placeholder="State" required onChange={handleInputChange} className={styles.input} />
                <input type="text" name="pincode" placeholder="PIN Code" required onChange={handleInputChange} className={styles.input} />
              </div>
              <input type="tel" name="phone" placeholder="Phone" required onChange={handleInputChange} className={styles.input} />
            </div>
            
            <button 
              type="submit" 
              className={styles.payBtn} 
              disabled={isProcessing}
            >
              {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(total)}`}
            </button>
          </form>
        </div>
        
        {/* Right: Order Summary */}
        <div className={styles.summarySection}>
          <h2 className="h5">Order Summary</h2>
          
          <div className={styles.itemsList}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemImageWrapper}>
                  <Image src={item.image} alt={item.name} fill className={styles.itemImage} />
                  <span className={styles.itemBadge}>{item.quantity}</span>
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemVariant}>{item.color} / {item.size}</p>
                </div>
                <p className={styles.itemPrice}>{formatPrice((item.salePrice || item.price) * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className={styles.finalTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CheckoutClient;
