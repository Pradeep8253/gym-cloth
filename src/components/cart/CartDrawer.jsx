"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import styles from './CartDrawer.module.css';

const FREE_SHIPPING_THRESHOLD = 5000;

const CartDrawer = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isCartOpen, setCartOpen, cartItems, removeFromCart, updateQuantity, getCartTotal } = useStore();
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getCartTotal();
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!mounted) return null;

  return (
    <>
      <div 
        className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setCartOpen(false)}
      />
      
      <div className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className="h4">YOUR BAG ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
          <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.shippingProgress}>
          {remainingForFreeShipping > 0 ? (
            <p>You're <strong>{formatPrice(remainingForFreeShipping)}</strong> away from Free Shipping.</p>
          ) : (
            <p>You've unlocked <strong>Free Shipping!</strong></p>
          )}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className={styles.itemsContainer}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={48} />
              <p>Your bag is empty.</p>
              <button 
                className={styles.continueBtn} 
                onClick={() => {
                  setCartOpen(false);
                  router.push('/shop');
                }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image src={item.image} alt={item.name} fill className={styles.image} />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <Link href={`/products/${item.slug}`} className={styles.itemName} onClick={() => setCartOpen(false)}>
                        {item.name}
                      </Link>
                      <button className={styles.removeBtn} onClick={() => removeFromCart(index)}>
                        <X size={16} />
                      </button>
                    </div>
                    <p className={styles.itemVariant}>{item.color} / {item.size}</p>
                    <div className={styles.itemFooter}>
                      <div className={styles.quantityControl}>
                        <button onClick={() => updateQuantity(index, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <p className={styles.itemPrice}>
                        {formatPrice((item.salePrice || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>SUBTOTAL</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className={styles.taxNotice}>Shipping & taxes calculated at checkout.</p>
            <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setCartOpen(false)}>
              PROCEED TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
