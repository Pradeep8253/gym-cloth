"use client";
import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import styles from './Admin.module.css';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Plus, Edit2, Trash2, X, Search, Inbox, LogOut } from 'lucide-react';
import { 
  useGetProductsQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  useGetAllOrdersQuery,
  useGetAllUsersQuery
} from '@/lib/store/apiSlice';

const AdminClient = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Products');
  
  // RTK Query hooks
  const { data: products = [], isLoading: isLoadingProducts, isError: isErrorProducts } = useGetProductsQuery();
  const { data: orders = [], isLoading: isLoadingOrders } = useGetAllOrdersQuery();
  const { data: usersData = [], isLoading: isLoadingUsers } = useGetAllUsersQuery();

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', salePrice: '', category: 'T-Shirts', gender: 'Men', sport: 'Gym', badge: '', image: '/images/products/tshirt.jpg', description: ''
  });

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, price: product.price, salePrice: product.salePrice || '', category: product.category, gender: product.gender, sport: product.sport, badge: product.badge || '', image: product.image, description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: '', salePrice: '', category: 'T-Shirts', gender: 'Men', sport: 'Gym', badge: '', image: '/images/products/tshirt.jpg', description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
    };

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...payload }).unwrap();
      } else {
        await addProduct(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save product: " + (err.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>VOLT</div>
        <nav className={styles.nav}>
          <button className={activeTab === 'Dashboard' ? styles.active : ''} onClick={() => setActiveTab('Dashboard')}>
            <LayoutDashboard size={20} className={styles.navIcon} /> Dashboard
          </button>
          <button className={activeTab === 'Products' ? styles.active : ''} onClick={() => setActiveTab('Products')}>
            <Package size={20} className={styles.navIcon} /> Products
          </button>
          <button className={activeTab === 'Orders' ? styles.active : ''} onClick={() => setActiveTab('Orders')}>
            <ShoppingCart size={20} className={styles.navIcon} /> Orders
          </button>
          <button className={activeTab === 'Customers' ? styles.active : ''} onClick={() => setActiveTab('Customers')}>
            <Users size={20} className={styles.navIcon} /> Customers
          </button>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <nav className={styles.nav}>
            <button>
              <Settings size={20} className={styles.navIcon} /> Settings
            </button>
            <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ color: '#ef4444' }}>
              <LogOut size={20} className={styles.navIcon} style={{ color: '#ef4444' }} /> Logout
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>{activeTab}</h1>
          <div className={styles.adminProfile}>
            <div className={styles.adminAvatar}>{getInitials(user?.email)}</div>
            <span>{user?.email}</span>
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Overview</h2>
            <p style={{ marginTop: '1rem', color: '#71717a' }}>Welcome to the Volt Admin Dashboard. Switch to the Products tab to manage inventory.</p>
          </div>
        )}

        {activeTab === 'Products' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Inventory Management</h2>
              <button className={styles.btnPrimary} onClick={() => openModal()}>
                <Plus size={18} /> Add Product
              </button>
            </div>

            {isLoadingProducts ? (
              <div className={styles.emptyState}>
                <p>Loading products...</p>
              </div>
            ) : isErrorProducts ? (
              <div className={styles.emptyState}>
                <p>Error loading products. Please try again later.</p>
              </div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                <Inbox size={48} strokeWidth={1} />
                <p>No products found in the inventory.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category / Sport</th>
                      <th>Price</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className={styles.productNameCell}>
                            <img src={p.image} alt={p.name} className={styles.productImg} />
                            <div>
                              <div style={{ fontWeight: 600, color: '#111' }}>{p.name}</div>
                              {p.badge && <span className={styles.statusBadge}>{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{p.category}</div>
                          <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{p.gender} • {p.sport}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          ₹{p.price}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className={styles.actionBtn} onClick={() => openModal(p)} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(p._id)} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Orders' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>All Orders</h2>
            </div>
            {isLoadingOrders ? (
              <div className={styles.emptyState}>
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <Inbox size={48} strokeWidth={1} />
                <p>No orders found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td style={{ fontWeight: 500 }}>{order._id.slice(-6).toUpperCase()}</td>
                        <td>
                          <div>{order.user?.name || 'Unknown User'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{order.user?.email}</div>
                        </td>
                        <td style={{ color: '#71717a' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${order.status === 'DELIVERED' ? styles.badgeSuccess : styles.badgePending}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          ₹{order.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Customers' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Customers</h2>
            </div>
            {isLoadingUsers ? (
              <div className={styles.emptyState}>
                <p>Loading customers...</p>
              </div>
            ) : usersData.length === 0 ? (
              <div className={styles.emptyState}>
                <Users size={48} strokeWidth={1} />
                <p>No customers found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className={styles.productNameCell}>
                            <div className={styles.adminAvatar} style={{width: 36, height: 36, background: '#f4f4f5', color: '#111'}}>
                              {getInitials(u.email)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#111' }}>{u.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.statusBadge} style={{background: u.role === 'ADMIN' ? '#111' : '#f4f4f5', color: u.role === 'ADMIN' ? '#fff' : '#111'}}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ color: '#71717a' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} data-lenis-prevent="true">
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input required type="text" placeholder="e.g. Velocity Performance Tee" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label>Price (₹)</label>
                  <input required type="number" placeholder="1999" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label>Sale Price (₹)</label>
                  <input type="number" placeholder="Optional" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label>Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>Men</option><option>Women</option><option>Unisex</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>T-Shirts</option><option>Shorts</option><option>Joggers</option><option>Hoodies</option><option>Accessories</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label>Sport</label>
                  <select value={formData.sport} onChange={e => setFormData({...formData, sport: e.target.value})}>
                    <option>Gym</option><option>Running</option><option>Football</option><option>Basketball</option><option>Tennis</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label>Badge</label>
                  <input type="text" placeholder="e.g. NEW, BESTSELLER" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} />
                </div>
                <div className={styles.formGroup} style={{flex: 2}}>
                  <label>Image URL</label>
                  <input required type="text" placeholder="/images/products/..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <textarea 
                  rows={3}
                  style={{ padding: '0.85rem 1rem', border: '1px solid #d4d4d8', borderRadius: '8px', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Enter product description..."
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className={styles.btnPrimary} style={{ background: '#f4f4f5', color: '#111', boxShadow: 'none' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClient;
