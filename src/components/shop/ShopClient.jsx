"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import styles from './ShopClient.module.css';
import { useGetProductsQuery } from '@/lib/store/apiSlice';

const SORTS = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];
const CATEGORIES = ['T-Shirts', 'Shorts', 'Joggers', 'Hoodies', 'Accessories'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const SPORTS = ['Gym', 'Running', 'Football', 'Basketball', 'Tennis'];

const ShopContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(SORTS[0]);
  
  // Read current filters from URL
  const currentGender = searchParams.get('gender') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSport = searchParams.get('sport') || '';

  const { data: products = [], isLoading, isError } = useGetProductsQuery({
    gender: currentGender,
    category: currentCategory,
    sport: currentSport
  });

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.shopContainer}>
      <div className={styles.header}>
        <h1 className="h2">ALL PRODUCTS</h1>
        <p className={styles.resultCount}>{products.length} Results</p>
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.mobileFilterBtn}
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <SlidersHorizontal size={18} /> Filters
        </button>
        
        <div className={styles.sortDropdown}>
          <span>Sort by: {activeSort}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={styles.main}>
        <aside className={`${styles.sidebar} ${isMobileFiltersOpen ? styles.mobileOpen : ''}`}>
          {isMobileFiltersOpen && (
            <div className={styles.mobileClose} onClick={() => setIsMobileFiltersOpen(false)}>
              ✕ Close
            </div>
          )}
          
          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>GENDER</h4>
            <ul className={styles.filterList}>
              {GENDERS.map(g => (
                <li key={g}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={currentGender.toLowerCase() === g.toLowerCase()}
                      onChange={() => updateFilter('gender', currentGender.toLowerCase() === g.toLowerCase() ? '' : g.toLowerCase())}
                    />
                    <span>{g}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>CATEGORY</h4>
            <ul className={styles.filterList}>
              {CATEGORIES.map(c => (
                <li key={c}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={currentCategory.toLowerCase() === c.toLowerCase()}
                      onChange={() => updateFilter('category', currentCategory.toLowerCase() === c.toLowerCase() ? '' : c.toLowerCase())}
                    />
                    <span>{c}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>SPORT</h4>
            <ul className={styles.filterList}>
              {SPORTS.map(s => (
                <li key={s}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={currentSport.toLowerCase() === s.toLowerCase()}
                      onChange={() => updateFilter('sport', currentSport.toLowerCase() === s.toLowerCase() ? '' : s.toLowerCase())}
                    />
                    <span>{s}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className={styles.productGrid}>
          {isLoading ? (
            <p>Loading products...</p>
          ) : isError ? (
            <p>Error loading products.</p>
          ) : products.length === 0 ? (
            <p>No products found matching your filters.</p>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={{...product, id: product._id}} />
            ))
          )}
        </div>
      </div>
      
      {isMobileFiltersOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileFiltersOpen(false)}></div>
      )}
    </div>
  );
};

export default function ShopClient() {
  return (
    <Suspense fallback={<div className={styles.shopContainer}>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
