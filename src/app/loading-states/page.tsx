'use client';

import React from 'react';
import { ProjectPageTemplate } from '../layouts/ProjectPageTemplate';
import { PageHeader } from '../components/PageHeader';
import { Grid } from '../components/Grid';
import { Card } from '../components/Card';
import Link from 'next/link';

export default function LoadingStatesPage() {
    return (
        <ProjectPageTemplate>
            <PageHeader 
                title="Loading States" 
                description="A collection of loading indicators and animations"
                className="mb-8"
            />
            <Grid>
                <Card
                    title="AI Input Loader"
                    description="A loading indicator for AI input processing with a dynamic dot animation."
                >
                    <Link
                        href="/loading-states/ai-input-loader"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                    >
                        View Component
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </Card>
                <Card
                    title="Multi AI Input Loader"
                    description="Multiple synchronized loading indicators for parallel AI processing tasks."
                >
                    <Link
                        href="/loading-states/multi-ai-input-loader"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                    >
                        View Component
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </Card>
            </Grid>
        </ProjectPageTemplate>
    );
} 