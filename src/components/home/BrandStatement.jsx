"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BrandStatement.module.css';

gsap.registerPlugin(ScrollTrigger);

const BrandStatement = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const textLines = textRef.current.children;
    
    gsap.fromTo(textLines, 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.brandStatement}>
      <div className={styles.container}>
        <h2 ref={textRef} className={`${styles.statement} h1`}>
          <span>BUILT FOR</span>
          <span>THE DAYS</span>
          <span>YOU DON'T</span>
          <span className={styles.accent}>QUIT.</span>
        </h2>
      </div>
    </section>
  );
};

export default BrandStatement;
