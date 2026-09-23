import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './Sports.module.css';

export const metadata = {
  title: 'Shop by Sport | VOLT ATHLETICS',
};

const sportsData = [
  { name: 'Gym', image: '/images/products/tshirt_men.jpg' },
  { name: 'Running', image: '/images/products/shorts_women.jpg' },
  { name: 'Football', image: '/images/products/hoodie_football.jpg' },
  { name: 'Basketball', image: '/images/products/joggers_basketball.jpg' },
  { name: 'Tennis', image: '/images/products/tennis_accessories.jpg' }
];

export default function SportsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Shop by Sport</h1>
        <p className={styles.subtitle}>Gear engineered for your discipline</p>
      </div>
      
      <div className={styles.grid}>
        {sportsData.map((sport) => (
          <Link 
            key={sport.name} 
            href={`/shop?sport=${sport.name.toLowerCase()}`}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <Image 
                src={sport.image} 
                alt={`${sport.name} collection`} 
                fill
                className={styles.image}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
              <h2 className={styles.title}>{sport.name}</h2>
              <div className={styles.arrow}>
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
