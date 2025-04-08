'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/app/layouts/PageLayout';
import { MultiAIInputLoader } from './MultiAIInputLoader';
import { ControlBar } from '@/app/layouts/ControlBar';
import styles from '@/app/styles/designlab.module.css';

export default function MultiAIInputLoaderPage() {
    const [activeValue, setActiveValue] = useState<'P50' | 'P75' | 'P95'>('P50');
    const [isTriggered, setIsTriggered] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);

    const handleGenerateClick = () => {
        setShouldReset(false);
        setIsTriggered(true);
    };

    const handleComplete = () => {
        setIsTriggered(false);
    };

    return (
        <>
            <PageLayout>
                <div className={styles.loaderContainer}>
                    <MultiAIInputLoader 
                        selectedDuration={activeValue}
                        isTriggered={isTriggered}
                        shouldReset={shouldReset}
                        onThinkingComplete={handleComplete}
                    />
                </div>
            </PageLayout>
            <ControlBar>
                <div className={styles.controlSection}>
                    <h3 className={styles.controlSectionTitle}>Length</h3>
                    <div className={styles.tabGroup}>
                        <button
                            className={`${styles.tab} ${activeValue === 'P50' ? styles.active : ''}`}
                            onClick={() => setActiveValue('P50')}
                        >
                            5s
                        </button>
                        <button
                            className={`${styles.tab} ${activeValue === 'P75' ? styles.active : ''}`}
                            onClick={() => setActiveValue('P75')}
                        >
                            15s
                        </button>
                        <button
                            className={`${styles.tab} ${activeValue === 'P95' ? styles.active : ''}`}
                            onClick={() => setActiveValue('P95')}
                        >
                            38s
                        </button>
                    </div>
                </div>

                <div className={styles.controlButtonContainer}>
                    <button
                        className={`${styles.viewButton} w-full`}
                        onClick={handleGenerateClick}
                        disabled={isTriggered}
                    >
                        Play
                    </button>
                </div>
            </ControlBar>
        </>
    );
} 