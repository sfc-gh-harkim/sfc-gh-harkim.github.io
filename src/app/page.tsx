'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectPageTemplate } from './layouts/ProjectPageTemplate';
import { PageHeader } from './components/PageHeader';

export default function Home() {
  return (
    <ProjectPageTemplate>
      <PageHeader
        title="Design Lab"
        description="A collection of beautiful, reusable React components built with Next.js and Tailwind CSS."
        centered
        className="mb-8"
      />

      <div className="flex justify-center">
        <Link
          href="/loading-states"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
        >
          View Components
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </ProjectPageTemplate>
  );
}
