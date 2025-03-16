'use client';

import React from 'react';
import { ProjectPageTemplate } from '../layouts/ProjectPageTemplate';
import { PageHeader } from '../components/PageHeader';
import { Grid } from '../components/Grid';
import { Card } from '../components/Card';
import Link from 'next/link';

export default function AvatarPage() {
    return (
        <ProjectPageTemplate>
            <PageHeader 
                title="Avatar" 
                description="User avatar components with various states and styles"
                className="mb-8"
            />
            <Grid>
                <Card
                    title="Avatar States"
                    description="Different states and variations of the avatar component."
                >
                    <Link
                        href="/avatar/states"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                    >
                        View States
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </Card>
            </Grid>
        </ProjectPageTemplate>
    );
} 