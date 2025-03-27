'use client';

import React from 'react';
import { ProjectPageTemplate } from '../layouts/ProjectPageTemplate';
import { PageHeader } from '../components/PageHeader';

export default function AvatarPage() {
    return (
        <ProjectPageTemplate>
            <PageHeader 
                title="Avatar" 
                description="A versatile avatar component that supports various states, sizes, and expressions. This component is designed to be used in a variety of contexts, including chat interfaces, user profiles, and more."
            />
        </ProjectPageTemplate>
    );
} 