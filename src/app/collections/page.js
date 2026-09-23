import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './Collections.module.css';

export const metadata = {
  title: 'Collections | VOLT ATHLETICS',
};

const collections = [
  { 
    name: 'New Drop', 
    slug: 'new-drop',
    image: '/images/products/pro_tshirt.jpg'
  },
  { 
    name: 'Summer Essentials', 
    slug: 'summer-essentials',
    image: '/images/products/shorts_women.jpg'
  },
  { 
    name: 'Pro Performance', 
    slug: 'pro-performance',
    image: '/images/products/joggers_basketball.jpg'
  }
];

export default function CollectionsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Collections</h1>
        <p className={styles.subtitle}>Curated selections for peak performance</p>
      </div>
      
      <div className={styles.grid}>
        {collections.map(collection => (
          <Link 
            key={collection.slug} 
            href={`/collections/${collection.slug}`}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <Image 
                src={collection.image} 
                alt={`${collection.name} collection`} 
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
              <h2 className={styles.title}>{collection.name}</h2>
              <div className={styles.arrow}>
                <ArrowRight size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
