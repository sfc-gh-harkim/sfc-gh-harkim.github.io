'use client';

import React from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { BaseAIInputLoader } from '../ai-input-loader/BaseAIInputLoader';

export default function AIInputLoaderLoopingPage() {
    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <BaseAIInputLoader variant="looping" />
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 