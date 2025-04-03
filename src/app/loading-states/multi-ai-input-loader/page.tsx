'use client';

import React, { useState } from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { MultiAIInputLoader } from './MultiAIInputLoader';
import { ControlBar } from '@/app/layouts/ControlBar';
import styles from '@/app/styles/designlab.module.css';

export default function MultiAIInputLoaderPage() {
    const [activeValue, setActiveValue] = useState<'P50' | 'P75' | 'P95'>('P75');
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
            <ProjectPageTemplate>
                <div className={styles.loaderContainer}>
                    <MultiAIInputLoader 
                        selectedDuration={activeValue}
                        isTriggered={isTriggered}
                        shouldReset={shouldReset}
                        onThinkingComplete={handleComplete}
                    />
                </div>
            </ProjectPageTemplate>
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
                    <div className={styles.controlButtonGroup}>
                        <a
                            href={`/simulation/snowsight?tab=columns`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewButton}
                        >
                            Single Col
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.externalIcon}
                            >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </ControlBar>
        </>
    );
} 