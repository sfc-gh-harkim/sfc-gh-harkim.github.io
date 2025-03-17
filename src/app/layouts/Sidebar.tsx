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
      { title: 'AI Input Loader (Looping)', href: '/loading-states/ai-input-loader-looping' },
      { title: 'AI Input Loader (Shimmer)', href: '/loading-states/ai-input-loader-shimmer' },
      { title: 'Multi AI Input Loader', href: '/loading-states/multi-ai-input-loader' },
    ],
  },
  {
    title: 'Avatar',
    href: '/avatar',
    children: [
      { title: 'States', href: '/avatar/states' },
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
    <aside className="w-64 bg-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="text-xl font-bold text-gray-100 hover:text-gray-300">
          Design Lab
        </Link>
        <nav className="mt-8 space-y-4">
          {sidebarItems.map((item) => (
            <div key={item.href} className="space-y-2">
              <Link
                href={item.href}
                className={
                  normalizedPathname === normalizePath(item.href)
                    ? "block text-sm text-white font-bold"
                    : "block text-sm text-gray-300 hover:text-gray-100"
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
                          ? "block text-sm text-white font-bold"
                          : "block text-sm text-gray-400 hover:text-gray-300"
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