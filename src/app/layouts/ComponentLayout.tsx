import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface ComponentLayoutProps {
  children: ReactNode;
}

export function ComponentLayout({ children }: ComponentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
} 