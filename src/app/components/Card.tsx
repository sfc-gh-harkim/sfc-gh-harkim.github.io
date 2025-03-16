import React from 'react';
import Link from 'next/link';

interface CardProps {
    title: string;
    description: string;
    href?: string;
    children?: React.ReactNode;
}

export function Card({ title, description, href, children }: CardProps) {
    const content = (
        <div className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-400 mb-4">
                {description}
            </p>
            {children}
        </div>
    );

    if (href) {
        return (
            <Link
                href={href}
                className="block"
            >
                {content}
            </Link>
        );
    }

    return content;
} 