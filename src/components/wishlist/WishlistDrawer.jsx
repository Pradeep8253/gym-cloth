"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import styles from './WishlistDrawer.module.css';

const WishlistDrawer = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isWishlistOpen, setWishlistOpen, wishlistItems, toggleWishlist, addToCart } = useStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1, item.sizes?.[0] || 'M', item.colors?.[0] || '#000000');
    // Optionally remove from wishlist after adding to cart
    // toggleWishlist(item);
  };

  if (!mounted) return null;

  return (
    <>
      <div 
        className={`${styles.overlay} ${isWishlistOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setWishlistOpen(false)}
      />
      
      <div className={`${styles.drawer} ${isWishlistOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className="h4">YOUR WISHLIST ({wishlistItems.length})</h2>
          <button className={styles.closeBtn} onClick={() => setWishlistOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsContainer}>
          {wishlistItems.length === 0 ? (
            <div className={styles.emptyWishlist}>
              <Heart size={48} />
              <p>Your wishlist is empty.</p>
              <button 
                className={styles.continueBtn} 
                onClick={() => {
                  setWishlistOpen(false);
                  router.push('/shop');
                }}
              >
                EXPLORE PRODUCTS
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {wishlistItems.map((item) => (
                <div key={`${item.id || item.slug}`} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image src={item.image} alt={item.name} fill className={styles.image} />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <Link href={`/products/${item.slug}`} className={styles.itemName} onClick={() => setWishlistOpen(false)}>
                        {item.name}
                      </Link>
                      <button className={styles.removeBtn} onClick={() => toggleWishlist(item)}>
                        <X size={16} />
                      </button>
                    </div>
                    <p className={styles.itemVariant}>{item.category}</p>
                    <div className={styles.itemFooter}>
                      <p className={styles.itemPrice}>
                        {formatPrice(item.salePrice || item.price)}
                      </p>
                      <button className={styles.addToBagBtn} onClick={() => handleAddToCart(item)}>
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
