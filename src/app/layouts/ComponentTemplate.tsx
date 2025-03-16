import React, { ReactNode } from 'react';
import { ComponentLayout } from './ComponentLayout';

interface ComponentTemplateProps {
    children: ReactNode;
}

export function ComponentTemplate({ children }: ComponentTemplateProps) {
    return (
        <ComponentLayout>
            <main className="flex items-center justify-center">
                {children}
            </main>
        </ComponentLayout>
    );
} 