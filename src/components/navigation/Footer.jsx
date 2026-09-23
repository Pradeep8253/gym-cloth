import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>VOLT</Link>
            <p className={styles.tagline}>Engineered for movement. Designed for the relentless.</p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>SHOP</h4>
              <ul>
                <li><Link href="/shop?gender=men">Men</Link></li>
                <li><Link href="/shop?gender=women">Women</Link></li>
                <li><Link href="/sports">Sports</Link></li>
                <li><Link href="/collections">Collections</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>HELP</h4>
              <ul>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Shipping</Link></li>
                <li><Link href="#">Returns</Link></li>
                <li><Link href="#">Size Guide</Link></li>
                <li><Link href="#">FAQ</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>COMPANY</h4>
              <ul>
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Athletes</Link></li>
                <li><Link href="#">Stories</Link></li>
                <li><Link href="#">Careers</Link></li>
                <li><Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Admin Login</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.legal}>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Refund Policy</Link>
            <span>&copy; {new Date().getFullYear()} VOLT ATHLETICS.</span>
          </div>

          <div className={styles.social}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
            {/* <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a> */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
