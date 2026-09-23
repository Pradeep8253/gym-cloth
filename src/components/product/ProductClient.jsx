"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Star, ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import styles from './ProductClient.module.css';
import { useGetProductQuery } from '@/lib/store/apiSlice';

const ProductClient = ({ slug }) => {
  const { data: product, isLoading, isError } = useGetProductQuery(slug);
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { wishlistItems, toggleWishlist, addToCart } = useStore();
  const [accordionOpen, setAccordionOpen] = useState('description');
  
  const galleryRef = useRef(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
    }
  }, [product]);

  if (isLoading) return <div className={styles.container}><p>Loading product...</p></div>;
  if (isError || !product) return <div className={styles.container}><p>Product not found.</p></div>;

  const toggleAccordion = (section) => {
    setAccordionOpen(accordionOpen === section ? null : section);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.salePrice || product.price);

  const isWishlisted = wishlistItems.some(item => item.id === product._id || item.slug === product.slug);

  const handleAddToCart = () => {
    if (selectedSize || !product.sizes) {
      addToCart({ ...product, id: product._id }, 1, selectedSize || 'M', selectedColor || '#000000');
    }
  };

  // Ensure arrays exist for rendering
  const images = [product.image, product.image, product.image, product.image]; // Duplicating since DB has 1 image for now
  const colors = product.colors?.length > 0 ? product.colors : ['#000000'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* Left: Image Gallery */}
        <div className={styles.galleryContainer} ref={galleryRef}>
          <div className={styles.thumbnailList}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`${styles.thumbnail} ${activeImage === idx ? styles.thumbnailActive : ''}`}
                onClick={() => setActiveImage(idx)}
              >
                <Image src={img} alt={`Thumbnail ${idx}`} fill className={styles.thumbImg} />
              </div>
            ))}
          </div>
          <div className={styles.mainImageContainer}>
            <Image 
              src={images[activeImage]} 
              alt={product.name} 
              fill 
              className={styles.mainImg}
              priority
            />
          </div>
        </div>
        
        {/* Right: Product Info */}
        <div className={styles.infoContainer}>
          <div className={styles.header}>
            <h1 className="h3">{product.name}</h1>
            <p className={styles.price}>
              {product.salePrice && <span style={{ textDecoration: 'line-through', color: 'var(--muted)', marginRight: '0.5rem', fontSize: '1rem' }}>₹{product.price}</span>}
              {formattedPrice}
            </p>
          </div>
          
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={16} fill={star <= 4.8 ? "currentColor" : "none"} strokeWidth={1} />
              ))}
            </div>
            <span className={styles.reviewCount}>4.8 (124 Reviews)</span>
          </div>
          
          <div className={styles.colorSelection}>
            <p className={styles.selectionLabel}>Color: <span>{selectedColor}</span></p>
            <div className={styles.colorOptions}>
              {colors.map((color, idx) => (
                <button 
                  key={idx}
                  className={`${styles.colorBtn} ${selectedColor === color ? styles.colorBtnActive : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.sizeSelection}>
            <div className={styles.sizeHeader}>
              <p className={styles.selectionLabel}>Size</p>
              <button className={styles.sizeGuideBtn}><Ruler size={16} /> Size Guide</button>
            </div>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.addToBagBtn}
              onClick={handleAddToCart}
              disabled={!selectedSize}
              style={{ opacity: selectedSize ? 1 : 0.5, cursor: selectedSize ? 'pointer' : 'not-allowed' }}
            >
              {selectedSize ? 'ADD TO BAG' : 'SELECT A SIZE'}
            </button>
            <button 
              className={styles.wishlistBtn}
              onClick={() => toggleWishlist({ ...product, id: product._id })}
            >
              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? styles.wishlisted : ''} />
            </button>
          </div>
          
          <div className={styles.accordionContainer}>
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion('description')}>
                <span>DESCRIPTION</span>
                {accordionOpen === 'description' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div className={`${styles.accordionContent} ${accordionOpen === 'description' ? styles.open : ''}`}>
                <p>{product.description || 'No description available for this product.'}</p>
              </div>
            </div>
            
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion('tech')}>
                <span>TECHNOLOGY & MATERIALS</span>
                {accordionOpen === 'tech' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div className={`${styles.accordionContent} ${accordionOpen === 'tech' ? styles.open : ''}`}>
                <p>Featuring DRYCORE™ moisture management and AEROMESH™ ventilation.</p>
                <p><strong>Materials:</strong> 85% Recycled Polyester, 15% Elastane</p>
                <p><strong>Care:</strong> Machine wash cold with like colors. Do not bleach. Tumble dry low.</p>
              </div>
            </div>
            
            <div className={styles.accordionItem}>
              <button className={styles.accordionHeader} onClick={() => toggleAccordion('shipping')}>
                <span>SHIPPING & RETURNS</span>
                {accordionOpen === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <div className={`${styles.accordionContent} ${accordionOpen === 'shipping' ? styles.open : ''}`}>
                <p>Free standard shipping on all orders over ₹5,000. Complimentary returns within 30 days of delivery.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductClient;
