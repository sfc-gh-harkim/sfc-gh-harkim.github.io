'use client';

import React from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { AIInputLoaderShimmer } from './AIInputLoaderShimmer';

export default function AIInputLoaderShimmerPage() {
    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <AIInputLoaderShimmer />
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 