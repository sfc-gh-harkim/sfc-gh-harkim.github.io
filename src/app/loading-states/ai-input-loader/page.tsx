'use client';

import React, { useState } from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { BaseAIInputLoader } from './BaseAIInputLoader';
import { ControlBar } from '@/app/layouts/ControlBar';
import styles from '@/app/styles/designlab.module.css';

type Variant = 'looping' | 'shimmer' | 'combined';

export default function AIInputLoaderPage() {
    const [activeValue, setActiveValue] = useState<'P50' | 'P75' | 'P95'>('P50');
    const [isTriggered, setIsTriggered] = useState(false);
    const [shouldReset, setShouldReset] = useState(false);
    const [activeVariant, setActiveVariant] = useState<Variant>('combined');

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
                    <BaseAIInputLoader 
                        variant={activeVariant}
                        selectedDuration={activeValue}
                        isTriggered={isTriggered}
                        shouldReset={shouldReset}
                        onThinkingComplete={handleComplete}
                        onGenerateClick={handleGenerateClick}
                    />
                </div>
            </ProjectPageTemplate>
            <ControlBar>
                <div className={styles.controlSection}>
                    <h3 className={styles.controlSectionTitle}>Variant</h3>
                    <div className={styles.tabGroup}>
                        <button
                            className={`${styles.tab} ${activeVariant === 'combined' ? styles.active : ''}`}
                            onClick={() => setActiveVariant('combined')}
                        >
                            Combined
                        </button>
                        <button
                            className={`${styles.tab} ${activeVariant === 'looping' ? styles.active : ''}`}
                            onClick={() => setActiveVariant('looping')}
                        >
                            Looping
                        </button>
                        <button
                            className={`${styles.tab} ${activeVariant === 'shimmer' ? styles.active : ''}`}
                            onClick={() => setActiveVariant('shimmer')}
                        >
                            Shimmer
                        </button>
                    </div>
                </div>

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
                            href={`/loading-states/ai-input-loader/snowsight?tab=columns&variant=${activeVariant}`}
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
                        <a
                            href={`/loading-states/ai-input-loader/snowsight?tab=details&variant=${activeVariant}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewButton}
                        >
                            Single Object
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