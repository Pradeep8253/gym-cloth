"use client";
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ShopBySport.module.css';

gsap.registerPlugin(ScrollTrigger);

const sports = [
  { id: 1, name: 'RUNNING', image: '/images/categories/running.jpg', slug: 'running' },
  { id: 2, name: 'GYM', image: '/images/categories/gym.jpg', slug: 'gym' },
  { id: 3, name: 'TENNIS', image: '/images/categories/running.jpg', slug: 'tennis' },
  { id: 4, name: 'FOOTBALL', image: '/images/categories/gym.jpg', slug: 'football' },
];

const ShopBySport = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = containerRef.current.querySelectorAll(`.${styles.card}`);
    
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className="h2">TRAIN YOUR WAY.</h2>
          <Link href="/sports" className={styles.viewAll}>VIEW ALL SPORTS</Link>
        </div>
        
        <div ref={containerRef} className={styles.grid}>
          {sports.map((sport) => (
            <Link key={sport.id} href={`/shop?sport=${sport.slug}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={sport.image} 
                  alt={sport.name} 
                  fill 
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.content}>
                <h3 className={`${styles.sportName} h3`}>{sport.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopBySport;
