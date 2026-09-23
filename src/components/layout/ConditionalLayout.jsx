"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from "@/components/navigation/AnnouncementBar";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/wishlist/WishlistDrawer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Header />}
      <CartDrawer />
      <WishlistDrawer />
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
