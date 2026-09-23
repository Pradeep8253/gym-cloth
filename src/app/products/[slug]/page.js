import React from 'react';
import ProductClient from '@/components/product/ProductClient';

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
