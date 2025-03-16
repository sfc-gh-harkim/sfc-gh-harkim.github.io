import React, { ReactNode } from 'react';
import { ComponentLayout } from './ComponentLayout';

interface ProjectPageTemplateProps {
    children: ReactNode;
}

export function ProjectPageTemplate({ children }: ProjectPageTemplateProps) {
    return (
        <ComponentLayout>
            <div className="ml-64 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-7xl p-8">
                    {children}
                </div>
            </div>
        </ComponentLayout>
    );
} 