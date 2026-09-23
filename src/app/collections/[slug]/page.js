import React from 'react';
import ShopClient from '@/components/shop/ShopClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.replace('-', ' ').toUpperCase()} | VOLT ATHLETICS`,
  };
}

export default async function CollectionDetailPage({ params }) {
  const { slug } = await params;
  return (
    <div style={{ paddingTop: '2rem' }}>
      <div style={{ padding: '8rem 2rem 4rem', backgroundColor: 'var(--off-white)', textAlign: 'center', marginBottom: '-2rem' }}>
        <h1 className="h2" style={{ textTransform: 'uppercase' }}>{slug.replace('-', ' ')} COLLECTION</h1>
        <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Discover the latest gear engineered for your performance.</p>
      </div>
      <ShopClient />
    </div>
  );
}
