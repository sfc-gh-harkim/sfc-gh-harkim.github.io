'use client';

import React, { useState, useCallback } from 'react';
import { PageLayout } from '../../layouts/PageLayout';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';
import styles from './page.module.css';
import designStyles from '@/app/styles/designlab.module.css';

export default function DynamicExpressionsPage() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStopping, setIsStopping] = useState(false);

    const handleThinking = useCallback(() => {
        setIsPlaying(true);
        setIsStopping(false);
    }, []);

    const handleStop = useCallback(() => {
        setIsStopping(true);
    }, []);

    const handleComplete = useCallback(() => {
        setIsPlaying(false);
        setIsStopping(false);
    }, []);

    return (
        <PageLayout>
            <div className={styles.container}>
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <AnimatedAvatar 
                        width={200} 
                        height={200}
                        isPlaying={isPlaying}
                        isStopping={isStopping}
                        onComplete={handleComplete}
                    />
                    <div className={designStyles.buttonContainer}>
                        <button 
                            onClick={handleThinking}
                            className={designStyles.viewButton}
                            disabled={isPlaying}
                        >
                            Thinking
                        </button>
                        <button 
                            className={designStyles.viewButton}
                            disabled={true}
                        >
                            Caution
                        </button>
                        <button 
                            className={designStyles.viewButton}
                            disabled={true}
                        >
                            Idle
                        </button>
                        <button 
                            onClick={handleStop}
                            className={designStyles.viewButton}
                            disabled={!isPlaying || isStopping}
                        >
                            Stop
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
} 