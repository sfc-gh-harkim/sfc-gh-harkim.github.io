import React from 'react';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';
import styles from '@/app/styles/documentation.module.css';

interface ProjectPageTemplateProps {
    children: React.ReactNode;
    showTabs?: boolean;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export function ProjectPageTemplate({ 
    children, 
    showTabs = false,
    activeTab,
    onTabChange 
}: ProjectPageTemplateProps) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    
    // Get the page title from the pathname
    const getPageTitle = () => {
        const path = pathname.split('/').filter(Boolean);
        if (path.length === 0) return '';
        
        // For project pages (e.g., /avatar, /loading-states)
        if (path.length === 1) {
            return path[0].split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        
        // For component pages (e.g., /avatar/states, /loading-states/ai-input-loader)
        if (path.length >= 2) {
            return path[path.length - 1].split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        
        return '';
    };

    const pageTitle = getPageTitle();
    
    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${isHomePage ? 'bg-[#0080c2]' : 'bg-gray-900'}`}>
            <Sidebar />
            <main className="flex-1 min-h-screen">
                <div className="w-full max-w-[800px] mx-auto px-8 py-9">
                    <div className={`${!isHomePage ? 'font-inter' : ''}`}>
                        {!isHomePage && pageTitle && (
                            <>
                                <h2 className="text-[28px] leading-[35px] font-semibold text-gray-100 font-plus-jakarta-sans">
                                    {pageTitle}
                                </h2>
                                {showTabs && (
                                    <div className={styles.tabGroup}>
                                        <button
                                            className={`${styles.tab} ${activeTab === 'looping' ? styles.active : ''}`}
                                            onClick={() => onTabChange?.('looping')}
                                        >
                                            Looping
                                        </button>
                                        <button
                                            className={`${styles.tab} ${activeTab === 'shimmer' ? styles.active : ''}`}
                                            onClick={() => onTabChange?.('shimmer')}
                                        >
                                            Shimmer
                                        </button>
                                        <button
                                            className={`${styles.tab} ${activeTab === 'combined' ? styles.active : ''}`}
                                            onClick={() => onTabChange?.('combined')}
                                        >
                                            Combined
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        <div className={styles.mainContent}>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 