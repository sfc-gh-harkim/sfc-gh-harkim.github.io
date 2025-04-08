'use client';

import React, { useState } from 'react';
import styles from '@/app/styles/designlab.module.css';
import { useAuth } from '../contexts/AuthContext';

export function PasswordProtection({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isMounted, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (login(password)) {
      // Successfully authenticated
      setIsSubmitting(false);
    } else {
      setError('Incorrect password. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Don't show anything while checking authentication status
  if (!isMounted) {
    return null;
  }

  // Show content if the user is authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show the password form if the user is not authenticated
  return (
    <div className={styles.protectedContainer}>
      <div className={styles.authCard}>
        <div className={styles.authCardHeader}>
          <h2 className={styles.controlTitle}>
            DesignLab Access
          </h2>
          <div className={styles.authCardDescription}>
            This area is password protected. Please enter the password to continue.
          </div>
        </div>
        
        <div className={styles.authCardBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                placeholder="Enter password"
                required
                autoFocus
              />
              {error && (
                <p className={styles.formError}>{error}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.viewButton}
              style={{ width: '100%' }}
            >
              {isSubmitting ? (
                'Verifying...'
              ) : (
                <>
                  Access DesignLab
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className={styles.authCardFooter}>
          <p className={styles.authCardFooterText}>
            If you need access, please contact the Design System team for the password.
          </p>
        </div>
      </div>
    </div>
  );
} 