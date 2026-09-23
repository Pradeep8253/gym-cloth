"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { wishlistItems, toggleWishlist, addToCart } = useStore();

  // Fallback data for demo
  const p = product || {
    slug: 'performance-tshirt',
    name: 'Performance T-Shirt',
    category: 'Men / Training',
    price: 1999,
    salePrice: null,
    badge: 'NEW',
    image: '/images/products/tshirt.jpg',
    colors: ['#000000', '#ffffff', '#4a4a4a']
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(p.price);

  const isWishlisted = wishlistItems.some(item => item.id === p.id || item.slug === p.slug);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, 1, p.sizes?.[0] || 'M', p.colors?.[0] || '#000000');
  };

  return (
    <div 
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageContainer}>
        {p.badge && <span className={styles.badge}>{p.badge}</span>}
        
        <button 
          className={styles.wishlistBtn}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p); }}
          aria-label="Add to Wishlist"
        >
          <Heart size={20} className={isWishlisted ? styles.wishlisted : ''} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <Link href={`/products/${p.slug}`} className={styles.imageLink}>
          <Image 
            src={p.image} 
            alt={p.name} 
            fill 
            className={`${styles.image} ${isHovered ? styles.imageHovered : ''}`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
        
        <div className={`${styles.quickAdd} ${isHovered ? styles.quickAddVisible : ''}`}>
          <button className={styles.quickAddBtn} onClick={handleQuickAdd}>QUICK ADD</button>
        </div>
      </div>
      
      <div className={styles.info}>
        <div className={styles.colors}>
          {p.colors && p.colors.map((color, index) => (
            <span key={index} className={styles.colorSwatch} style={{ backgroundColor: color }}></span>
          ))}
        </div>
        <div className={styles.details}>
          <div>
            <h3 className={styles.name}>
              <Link href={`/products/${p.slug}`}>{p.name}</Link>
            </h3>
            <p className={styles.category}>{p.category}</p>
          </div>
          <div className={styles.priceContainer}>
            {p.salePrice ? (
              <>
                <span className={styles.salePrice}>₹{p.salePrice}</span>
                <span className={styles.originalPrice}>{formattedPrice}</span>
              </>
            ) : (
              <span className={styles.price}>{formattedPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
