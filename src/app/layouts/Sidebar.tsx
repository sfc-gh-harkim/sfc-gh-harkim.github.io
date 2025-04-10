'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/designlab.module.css';
import { useAuth } from '@/app/contexts/AuthContext';

interface SidebarItem {
  title: string;
  href: string;
  children?: SidebarItem[];
  external?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Loading States',
    href: '/loading-states',
    children: [
      { title: 'AI Input Loader', href: '/loading-states/ai-input-loader' },
      { title: 'AI Input Loader (Performant)', href: '/loading-states/ai-input-loader-performant' },
      { title: 'Multi AI Input Loader', href: '/loading-states/multi-ai-input-loader' },
    ],
  },
  {
    title: 'Avatar',
    href: '/avatar',
    children: [
      { title: 'States', href: '/avatar/states' },
      { title: 'Dynamic Expressions', href: '/avatar/dynamic-expressions' },
    ],
  },
  {
    title: 'Snowflake Intelligence',
    href: '/simulation/intelligence',
    external: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { isAuthenticated, logout } = useAuth();
  
  // Normalize paths by removing trailing slashes except for root
  const normalizePath = (path: string) => {
    return path === '/' ? path : path.replace(/\/$/, '');
  };
  
  const normalizedPathname = normalizePath(pathname);

  useEffect(() => {
    // Check initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'dark' | 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 overflow-y-auto font-plus-jakarta-sans z-50 hidden xl:block">
      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[32px] leading-[40px] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)]">
            DesignLab
          </Link>
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-8 space-y-4 flex-grow">
          {sidebarItems.map((item) => (
            <div key={item.href} className="space-y-2">
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={
                  normalizedPathname === normalizePath(item.href)
                    ? "block text-sm text-[var(--color-text-primary)] font-bold"
                    : "block text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                }
              >
                <div className="flex items-center gap-2">
                  {item.title}
                  {item.external && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 3.5H3.5C2.67157 3.5 2 4.17157 2 5V12.5C2 13.3284 2.67157 14 3.5 14H11C11.8284 14 12.5 13.3284 12.5 12.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2L8 8M14 2V5.5M14 2H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </Link>
              {item.children && (
                <div className="ml-4 space-y-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={
                        normalizedPathname === normalizePath(child.href)
                          ? "block text-sm text-[var(--color-text-primary)] font-bold"
                          : "block text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                      }
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {isAuthenticated && pathname === '/' && (
          <div className="mt-4 pt-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors py-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
} 