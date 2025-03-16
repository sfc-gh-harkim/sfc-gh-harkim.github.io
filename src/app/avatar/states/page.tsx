'use client';

import React from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import AvatarStates from './States';

export default function AvatarStatesPage() {
    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <AvatarStates />
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 