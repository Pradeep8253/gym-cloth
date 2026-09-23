"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('OTP has been sent to your email.');
        setTimeout(() => {
          setSuccess('');
          setStep(2);
        }, 2000);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep(3);
      setError('');
    } else {
      setError('Please enter a valid 6-digit OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 2rem 4rem', backgroundColor: 'var(--off-white)' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
        <h1 className="h3" style={{ marginBottom: '0.5rem' }}>Reset Password</h1>
        
        {step === 1 && <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Enter your email address and we'll send you an OTP to reset your password.</p>}
        {step === 2 && <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Enter the 6-digit OTP sent to {email}</p>}
        {step === 3 && <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Enter your new password below.</p>}
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
        {success && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{success}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '0.875rem' }} />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '1.25rem', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'SENDING...' : 'SEND OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label htmlFor="otp" style={{ fontSize: '0.875rem', fontWeight: '500' }}>OTP</label>
              <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} required placeholder="Enter 6-digit OTP" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '1.25rem', textAlign: 'center', letterSpacing: '0.2em' }} />
            </div>
            <button type="submit" style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '1.25rem', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}>
              VERIFY OTP
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}>
              Change Email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label htmlFor="newPassword" style={{ fontSize: '0.875rem', fontWeight: '500' }}>New Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="newPassword" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  minLength={6} 
                  style={{ width: '100%', padding: '1rem', paddingRight: '3rem', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit', fontSize: '0.875rem', transition: 'all 0.2s ease' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--black)', color: 'var(--white)', padding: '1.25rem', fontSize: '0.875rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
          </form>
        )}
        
        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          <p>Remember your password? <Link href="/login" style={{ color: 'var(--black)', fontWeight: '600', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
