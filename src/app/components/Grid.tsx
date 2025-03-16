import React, { ReactNode } from 'react';

interface GridProps {
    children: ReactNode;
    className?: string;
    cols?: 1 | 2 | 3 | 4;
}

export function Grid({ children, className = '', cols = 2 }: GridProps) {
    const getGridCols = () => {
        switch (cols) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-1 md:grid-cols-2';
            case 3:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
            case 4:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
            default:
                return 'grid-cols-1 md:grid-cols-2';
        }
    };

    return (
        <div className={`grid gap-6 ${getGridCols()} ${className}`}>
            {children}
        </div>
    );
} 