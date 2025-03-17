'use client';

import React from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { AIInputLoaderLooping } from './AIInputLoaderLooping';

export default function AIInputLoaderLoopingPage() {
    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <AIInputLoaderLooping />
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 