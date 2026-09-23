"use client";
import React, { useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import styles from './NewDrop.module.css';
import { useGetProductsQuery } from '@/lib/store/apiSlice';

const TABS = ['ALL', 'MEN', 'WOMEN', 'TRAINING', 'RUNNING'];

const NewDrop = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const { data: products = [], isLoading, isError } = useGetProductsQuery();

  const filteredProducts = products.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'MEN' || activeTab === 'WOMEN') return p.gender.toUpperCase() === activeTab;
    if (activeTab === 'TRAINING') return p.sport.toUpperCase() === 'GYM' || p.sport.toUpperCase() === 'TRAINING';
    if (activeTab === 'RUNNING') return p.sport.toUpperCase() === 'RUNNING';
    return true;
  }).slice(0, 4); // Show max 4 products

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className="h2">THE NEW DROP</h2>
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button 
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.grid}>
          {isLoading ? (
            <p>Loading new drop...</p>
          ) : isError ? (
            <p>Error loading new drop.</p>
          ) : filteredProducts.map(product => (
            <ProductCard key={product._id} product={{...product, id: product._id}} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewDrop;
