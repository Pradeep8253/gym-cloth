"use client";
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PerformanceTech.module.css';

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  {
    id: 'drycore',
    name: 'DRYCORE™',
    description: 'Advanced moisture-wicking yarns engineered to pull sweat away from the body, dispersing it across the fabric surface for rapid evaporation.',
  },
  {
    id: 'flexweave',
    name: 'FLEXWEAVE™',
    description: 'Multi-directional stretch construction that moves in perfect sync with your body without losing shape or compression over time.',
  },
  {
    id: 'thermoshield',
    name: 'THERMOSHIELD™',
    description: 'Strategic thermal mapping that traps heat where you need it while venting excess warmth during high-intensity output.',
  },
  {
    id: 'aeromesh',
    name: 'AEROMESH™',
    description: 'Engineered micro-perforations in high-sweat zones mapped directly to athlete heat signatures for maximum breathability.',
  }
];

const PerformanceTech = () => {
  const [activeTech, setActiveTech] = useState(technologies[0]);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    // Reveal animation
    gsap.fromTo(sectionRef.current, 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        }
      }
    );
  }, []);

  useEffect(() => {
    // Image transition when active tech changes
    gsap.fromTo(imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [activeTech]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className="h2">ENGINEERED TO PERFORM.</h2>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.techList}>
            {technologies.map(tech => (
              <div 
                key={tech.id} 
                className={`${styles.techItem} ${activeTech.id === tech.id ? styles.active : ''}`}
                onClick={() => setActiveTech(tech)}
                onMouseEnter={() => setActiveTech(tech)}
              >
                <h3 className="h3">{tech.name}</h3>
                <div className={styles.techDescContainer}>
                  <p className={styles.techDesc}>{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.visualizer}>
            <div className={styles.imageWrapper}>
              <Image 
                ref={imageRef}
                src="/images/technology/texture.jpg" 
                alt="Technology Texture" 
                fill 
                className={styles.image}
              />
              <div className={styles.scanline}></div>
              <div className={styles.hudOverlay}>
                <div className={styles.hudCornerTopLeft}></div>
                <div className={styles.hudCornerTopRight}></div>
                <div className={styles.hudCornerBottomLeft}></div>
                <div className={styles.hudCornerBottomRight}></div>
                <span className={styles.hudText}>ANALYZING: {activeTech.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceTech;
