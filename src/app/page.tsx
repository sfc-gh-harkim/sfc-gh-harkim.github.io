'use client';

import React from 'react';
import { ProjectPageTemplate } from './layouts/ProjectPageTemplate';
import { PageHeader } from './components/PageHeader';

export default function Home() {
  return (
    <ProjectPageTemplate>
      <PageHeader
        title="DesignLab"
        description={<>Welcome to <a href="https://snowflake.enterprise.slack.com/team/U088AC6FKEH" target="_blank" rel="noopener noreferrer" className="hover:text-white">@harold.kim</a>&apos;s personal sandbox at Snowflake Design.<br />All concepts are built in Next.js, Tailwind, and Balto. Please do not reference this document as a source of truth.</>}
        centered
      />
    </ProjectPageTemplate>
  );
}
