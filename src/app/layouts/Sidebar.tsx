'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  
  // Normalize paths by removing trailing slashes except for root
  const normalizePath = (path: string) => {
    return path === '/' ? path : path.replace(/\/$/, '');
  };
  
  const normalizedPathname = normalizePath(pathname);

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 overflow-y-auto font-plus-jakarta-sans z-50 hidden xl:block">
      <div className="p-8">
        <Link href="/" className="text-[32px] leading-[40px] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)]">
          DesignLab
        </Link>
        <nav className="mt-8 space-y-4">
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