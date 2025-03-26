import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    description?: ReactNode;
    className?: string;
    centered?: boolean;
    figmaLink?: string;
    reviewDocLink?: string;
    presentationLink?: string;
}

export function PageHeader({ 
    title, 
    description, 
    className = '', 
    centered = false,
    figmaLink,
    reviewDocLink,
    presentationLink
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
            {!isHomePage && (figmaLink || reviewDocLink || presentationLink) && (
                <div className="mt-6 flex gap-4">
                    {figmaLink && (
                        <Link 
                            href={figmaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-white hover:text-white/80"
                        >
                            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.332 8.668a3.333 3.333 0 0 0 0-6.663H8.668a3.333 3.333 0 0 0 0 6.663 3.333 3.333 0 0 0 0 6.665 3.333 3.333 0 0 0 0 6.662h6.664a3.333 3.333 0 0 0 0-6.662 3.333 3.333 0 0 0 0-6.665Zm0 0"/>
                            </svg>
                            Figma
                        </Link>
                    )}
                    {reviewDocLink && (
                        <Link 
                            href={reviewDocLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-white hover:text-white/80"
                        >
                            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1L20 6m0 0v5m0-5h-5"/>
                            </svg>
                            Review Doc
                        </Link>
                    )}
                    {presentationLink && (
                        <Link 
                            href={presentationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-white hover:text-white/80"
                        >
                            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 0M16 2v4M8 2v4m-5 4h18"/>
                            </svg>
                            Presentation
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}