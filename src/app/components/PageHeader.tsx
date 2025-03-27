import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    description?: ReactNode;
    className?: string;
    centered?: boolean;
}

export function PageHeader({ 
    title, 
    description, 
    className = '', 
    centered = false,
}: PageHeaderProps) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    
    const headingClasses = isHomePage 
        ? "text-[72px] leading-[90px] font-semibold text-gray-100 font-plus-jakarta-sans text-center"
        : "text-[28px] leading-[35px] font-semibold text-gray-100 font-plus-jakarta-sans";
    const descriptionClasses = isHomePage
        ? `mt-8 text-white/80 sm:text-lg md:text-xl text-center max-w-3xl mx-auto font-plus-jakarta-sans`
        : `mt-3 text-gray-400 text-[16px] leading-[24px] ${centered ? 'max-w-3xl mx-auto' : ''} font-plus-jakarta-sans`;

    return (
        <div className={`font-plus-jakarta-sans ${className}`}>
            {isHomePage && (
                <h1 className={headingClasses}>
                    {title}
                </h1>
            )}
            {description && (
                <div className={descriptionClasses}>
                    {description}
                </div>
            )}
        </div>
    );
}