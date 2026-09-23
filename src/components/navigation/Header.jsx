"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Search, User, Heart, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import useStore from '@/lib/store/useStore';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const Header = () => {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, cartItems, wishlistItems, setWishlistOpen } = useStore();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlistItems ? wishlistItems.length : 0;

  useEffect(() => {
    setMounted(true);
    setIsScrolled(window.scrollY > 50 || !isHome);
  }, [isHome]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50 || !isHome);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <header ref={headerRef} className={`${styles.header} ${isScrolled ? styles.solid : ''}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            VOLT
          </Link>
        </div>
        
        <nav className={styles.center}>
          <ul className={styles.navLinks}>
            <li><Link href="/shop?gender=men">MEN</Link></li>
            <li><Link href="/shop?gender=women">WOMEN</Link></li>
            <li><Link href="/sports">SPORTS</Link></li>
            <li><Link href="/shop?category=t-shirts">T-SHIRTS</Link></li>
            <li><Link href="/collections/new-drop">NEW</Link></li>
            <li><Link href="/collections">COLLECTIONS</Link></li>
          </ul>
        </nav>
        
        <div className={styles.right}>
          <button className={styles.iconBtn} aria-label="Search"><Search size={20} /></button>
          
          {session ? (
            <>
              <Link href={session.user.role === 'ADMIN' ? '/admin' : '/dashboard'} className={styles.iconBtn} aria-label="Dashboard">
                <User size={20} />
              </Link>
              <button className={styles.iconBtn} onClick={() => signOut()} aria-label="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.iconBtn} aria-label="Login">
              <User size={20} />
            </Link>
          )}
          
          <button className={styles.iconBtn} onClick={() => setWishlistOpen(true)} aria-label="Wishlist">
            <Heart size={20} />
            {mounted && wishlistItemCount > 0 && <span className={styles.cartBadge}>{wishlistItemCount}</span>}
          </button>
          <button className={styles.iconBtn} aria-label="Cart" onClick={toggleCart}>
            <ShoppingBag size={20} />
            {mounted && cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
          </button>
          
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <nav className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
        <ul>
          <li><Link href="/shop?gender=men" onClick={() => setMobileMenuOpen(false)}>MEN</Link></li>
          <li><Link href="/shop?gender=women" onClick={() => setMobileMenuOpen(false)}>WOMEN</Link></li>
          <li><Link href="/sports" onClick={() => setMobileMenuOpen(false)}>SPORTS</Link></li>
          <li><Link href="/shop?category=t-shirts" onClick={() => setMobileMenuOpen(false)}>T-SHIRTS</Link></li>
          <li><Link href="/collections/new-drop" onClick={() => setMobileMenuOpen(false)}>NEW</Link></li>
          <li><Link href="/collections" onClick={() => setMobileMenuOpen(false)}>COLLECTIONS</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
