'use client';

import React from 'react';
import { PageLayout } from '@/app/layouts/PageLayout';
import styles from '@/app/styles/designlab.module.css';

export default function MultiAIInputLoaderPage() {
    return (
        <PageLayout>
            <div className={styles.loaderContainer}>
                <iframe src="/demos/loading-states/multi-input-loader-demo/" style={{ width: '100%', height: '800px', border: 'none' }} />
            </div>
        </PageLayout>
    );
} 