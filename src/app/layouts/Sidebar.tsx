'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/designlab.module.css';

interface SidebarItem {
  title: string;
  href: string;
  children?: SidebarItem[];
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
];

export function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
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
                className={
                  normalizedPathname === normalizePath(item.href)
                    ? "block text-sm text-[var(--color-text-primary)] font-bold"
                    : "block text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                }
              >
                {item.title}
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
      </div>
    </aside>
  );
} 