"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './Hero.module.css';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // GSAP Timeline for Hero reveal
    const tl = gsap.timeline();
    
    // Initial state setup
    gsap.set(contentRef.current.children, { y: 50, opacity: 0 });
    gsap.set(imageRef.current, { scale: 1.1, filter: "brightness(0)" });

    tl.to(imageRef.current, {
      scale: 1,
      filter: "brightness(0.6)",
      duration: 2,
      ease: "power3.out"
    })
    .to(contentRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=1.5");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.background}>
        <Image 
          ref={imageRef}
          src="/images/hero/hero-01.jpg"
          alt="Athlete training"
          fill
          priority
          className={styles.image}
        />
      </div>
      
      <div className={styles.overlay}></div>
      
      <div className={styles.contentContainer}>
        <div ref={contentRef} className={styles.content}>
          <span className={styles.label}>ENGINEERED FOR MOVEMENT</span>
          <h1 className={`${styles.title} h1`}>
            TRAIN<br/>HARDER.<br/>MOVE<br/>FURTHER.
          </h1>
          <p className={styles.description}>
            Performance apparel designed for training, running and everything between.
          </p>
          <div className={styles.actions}>
            <Link href="/shop?gender=men" className={styles.primaryBtn}>
              SHOP MEN
            </Link>
            <Link href="/shop?gender=women" className={styles.secondaryBtn}>
              SHOP WOMEN
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
