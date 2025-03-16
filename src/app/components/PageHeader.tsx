import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    centered?: boolean;
}

export function PageHeader({ title, description, className = '', centered = false }: PageHeaderProps) {
    return (
        <div className={`${centered ? 'text-center' : ''} ${className}`}>
            <h1 className="text-3xl font-bold text-gray-100 sm:text-4xl md:text-5xl">
                {title}
            </h1>
            {description && (
                <p className={`mt-3 text-gray-400 sm:text-lg md:text-xl ${centered ? 'max-w-3xl mx-auto' : ''}`}>
                    {description}
                </p>
            )}
        </div>
    );
} 