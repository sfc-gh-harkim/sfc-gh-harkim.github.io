'use client';

import React, { useState } from 'react';
import { ProjectPageTemplate } from '@/app/layouts/ProjectPageTemplate';
import { MultiAIInputLoader } from './MultiAIInputLoader';
import styles from '@/app/styles/documentation.module.css';

export default function MultiAIInputLoaderPage() {
    const [isTriggered, setIsTriggered] = useState(false);

    return (
        <ProjectPageTemplate>
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-md">
                    <MultiAIInputLoader
                        variant="looping"
                        isTriggered={isTriggered}
                        count={6}
                    />
                    <div className="mt-8 flex justify-center gap-3">
                        <button
                            className={styles.viewButton}
                            onClick={() => setIsTriggered(prev => !prev)}
                        >
                            {isTriggered ? 'Reset' : 'Start Demo'}
                        </button>
                        <a
                            href="/loading-states/ai-input-loader/in-situ?tab=columns"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewButton}
                        >
                            Bulk Cols
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
            </div>
        </ProjectPageTemplate>
    );
} 