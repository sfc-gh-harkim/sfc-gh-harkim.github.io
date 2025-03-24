'use client';

import React from 'react';
import { ProjectPageTemplate } from '../layouts/ProjectPageTemplate';
import { PageHeader } from '../components/PageHeader';

export default function AvatarPage() {
    return (
        <ProjectPageTemplate>
            <PageHeader 
                title="Avatar" 
                description="A versatile avatar component that supports various states, sizes, and expressions."
                figmaLink="https://www.figma.com/file/example-avatar"
                reviewDocLink="https://docs.google.com/document/d/example-avatar"
                presentationLink="https://docs.google.com/presentation/d/example-avatar"
            />
        </ProjectPageTemplate>
    );
} 