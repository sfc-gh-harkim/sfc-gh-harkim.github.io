'use client';

import React, { useState, useCallback } from 'react';
import { ProjectPageTemplate } from '../../layouts/ProjectPageTemplate';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';
import styles from './page.module.css';
import docStyles from '@/app/styles/documentation.module.css';

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

    return (
        <ProjectPageTemplate>
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
                    />
                    <div className={docStyles.buttonContainer}>
                        <button 
                            onClick={handleThinking}
                            className={docStyles.viewButton}
                            disabled={isPlaying}
                        >
                            Thinking
                        </button>
                        <button 
                            onClick={handleStop}
                            className={docStyles.viewButton}
                            disabled={!isPlaying || isStopping}
                        >
                            Stop
                        </button>
                    </div>
                </div>
            </div>
        </ProjectPageTemplate>
    );
} 