"use client";
import React from 'react';
import styles from './Dashboard.module.css';
import { Package, User, MapPin, Heart } from 'lucide-react';
import { useGetOrdersQuery } from '@/lib/store/apiSlice';

const DashboardClient = ({ user }) => {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="h2">My Account</h1>
        <p>Welcome back, {user.name} ({user.email})</p>
      </div>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <User size={24} />
            <h2 className="h4">Profile Details</h2>
          </div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 className="h3" style={{ marginBottom: '1.5rem' }}>Your Orders</h2>
        {isLoading ? (
          <p>Loading your orders...</p>
        ) : isError ? (
          <p>Error loading orders.</p>
        ) : orders.length === 0 ? (
          <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
            <Package size={48} style={{ margin: '0 auto 1rem', color: 'var(--muted)' }} />
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order._id} className={styles.card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardClient;
