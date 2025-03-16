'use client';

import React from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { AIInputLoader } from './AIInputLoader';

export default function AIInputLoaderPage() {
    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <AIInputLoader />
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 