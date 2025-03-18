import React from 'react';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

interface ProjectPageTemplateProps {
    children: React.ReactNode;
}

export function ProjectPageTemplate({ children }: ProjectPageTemplateProps) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    
    const mainClasses = isHomePage
        ? "min-h-screen flex items-center"
        : "";

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isHomePage ? 'bg-[#0080c2]' : 'bg-gray-900'}`}>
            <Sidebar />
            <main className={mainClasses}>
                <div className={`w-full max-w-[800px] mx-auto py-12 px-8 ${!isHomePage ? 'font-inter' : ''}`}>
                    {children}
                </div>
            </main>
        </div>
    );
} 