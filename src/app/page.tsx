'use client';

import React from 'react';
import { PageLayout } from './layouts/PageLayout';
import { PageHeader } from './components/PageHeader';

export default function Home() {
  return (
    <PageLayout>
      <PageHeader
        title="DesignLab"
        description={<>Welcome to the Design System testing grounds at Snowflake.<br />All concepts are built in Next.js, Tailwind, and Balto. Please do not reference this document as a source of truth.</>}
        centered
      />
    </PageLayout>
  );
}
