'use client';

import React from 'react';
import { ProjectPageTemplate } from './layouts/ProjectPageTemplate';
import { PageHeader } from './components/PageHeader';

export default function Home() {
  return (
    <ProjectPageTemplate>
      <PageHeader
        title="DesignLab"
        description={<>Welcome to the Design System testing grounds at Snowflake.<br />All concepts are built in Next.js, Tailwind, and Balto. Please do not reference this document as a source of truth.</>}
        centered
      />
    </ProjectPageTemplate>
  );
}
