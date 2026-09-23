"use client";
import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Auth.module.css';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        const session = await getSession();
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your Volt Athletics account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.forgotPassword}>
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account? <Link href="/register">Register</Link></p>
        </div>

        <div className={styles.demoBox}>
          <h4>Demo Access</h4>
          <div className={styles.demoRow}>
            <span><strong>Admin:</strong> admin@volt.com</span>
            <button className={styles.demoBtn} onClick={() => {setEmail('admin@volt.com'); setPassword('admin123');}}>
              Auto Fill
            </button>
          </div>
          <div className={styles.demoRow}>
            <span><strong>User:</strong> user@volt.com</span>
            <button className={styles.demoBtn} onClick={() => {setEmail('user@volt.com'); setPassword('user123');}}>
              Auto Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
