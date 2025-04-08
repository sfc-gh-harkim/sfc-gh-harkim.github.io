'use client';

import React from 'react';
import { PageLayout } from '../layouts/PageLayout';
import { PageHeader } from '../components/PageHeader';

export default function LoadingStatesPage() {
    return (
        <PageLayout>
            <PageHeader 
                title="Loading States" 
                description="This project is crucial because current loading state patterns fail to accommodate the long processing times often associated with AI features, detracting from the user experience and discouraging adoption. By delivering new, inclusive AI loading state patterns that gracefully manage these longer durations, we can directly address this pain point and pave the way for the seamless integration of AI features throughout Snowflake experiences, ultimately driving increased user engagement and adoption of AI-powered capabilities."
            />
        </PageLayout>
    );
} 