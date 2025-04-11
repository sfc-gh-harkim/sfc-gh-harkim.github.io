'use client';

import React from 'react';
import { PageLayout } from './layouts/PageLayout';
import { PageHeader } from './components/PageHeader';
import Image from 'next/image';

export default function Home() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="mb-8 mt-4">
          <Image 
            src="/assets/intelligence/logo.svg"
            alt="Snowflake Logo"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>
        <PageHeader
          title="DesignLab"
          description={<>Welcome to the Design System testing grounds at Snowflake.<br />All concepts are built in Next.js, Tailwind, and Balto. Please do not reference this document as a source of truth.</>}
          centered
        />
      </div>
    </PageLayout>
  );
}
