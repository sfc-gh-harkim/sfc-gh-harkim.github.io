'use client';

import React from 'react';
import { ProjectPageTemplate } from '../layouts/ProjectPageTemplate';
import { PageHeader } from '../components/PageHeader';

export default function LoadingStatesPage() {
    return (
        <ProjectPageTemplate>
            <PageHeader 
                title="Loading States" 
                description="This project is crucial because current loading state patterns fail to accommodate the long processing times often associated with AI features, detracting from the user experience and discouraging adoption. By delivering new, inclusive AI loading state patterns that gracefully manage these longer durations, we can directly address this pain point and pave the way for the seamless integration of AI features throughout Snowflake experiences, ultimately driving increased user engagement and adoption of AI-powered capabilities."
                figmaLink="https://www.figma.com/file/example-loading-states"
                reviewDocLink="https://docs.google.com/document/d/example-loading-states"
                presentationLink="https://docs.google.com/presentation/d/example-loading-states"
            />
        </ProjectPageTemplate>
    );
} 