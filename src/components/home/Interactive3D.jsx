"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import styles from './Interactive3D.module.css';

// Dynamically import the Three.js scene to avoid SSR and reduce initial bundle
const Scene = dynamic(() => import('@/components/three/HeroScene'), { 
  ssr: false,
  loading: () => <div className={styles.loading}>LOADING 3D ENGINE...</div>
});

const Interactive3D = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className="h2">MATERIAL INSPECTION</h2>
          <p className={styles.subtitle}>Interact to explore technical details</p>
        </div>
        
        <div className={styles.canvasContainer}>
          <Suspense fallback={<div className={styles.loading}>LOADING 3D ENGINE...</div>}>
            <Scene />
          </Suspense>
          
          <div className={styles.hotspots}>
            <div className={styles.hotspot} style={{ top: '30%', left: '30%' }}>
              <div className={styles.dot}></div>
              <div className={styles.info}>BREATHABLE</div>
            </div>
            <div className={styles.hotspot} style={{ top: '60%', left: '70%' }}>
              <div className={styles.dot}></div>
              <div className={styles.info}>FLEXIBLE</div>
            </div>
            <div className={styles.hotspot} style={{ top: '80%', left: '40%' }}>
              <div className={styles.dot}></div>
              <div className={styles.info}>LIGHTWEIGHT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Interactive3D;
