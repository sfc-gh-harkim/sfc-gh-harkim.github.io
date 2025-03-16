'use client';

import React from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { MultiAIInputLoader } from './MultiAIInputLoader';

export default function MultiAIInputLoaderPage() {
    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <MultiAIInputLoader />
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 