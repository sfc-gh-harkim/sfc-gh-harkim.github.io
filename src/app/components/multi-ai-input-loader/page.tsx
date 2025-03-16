'use client';

import { AIInputLoader } from '@/components/ai-input-loader/AIInputLoader';
import styles from './styles.module.css';
import { useState } from 'react';

export default function MultiAIInputLoaderPage() {
    const [isActive, setIsActive] = useState(false);

    const handleActivate = () => {
        setIsActive(true);
        // Reset after animation completes
        setTimeout(() => {
            setIsActive(false);
        }, 7000); // Slightly longer than the individual animation duration
    };

    return (
        <div className={styles.container}>
            <h1>Multi AI Input Loader</h1>
            <div className={styles.loadersContainer}>
                <AIInputLoader key="loader1" isTriggered={isActive} hideButton startDelay={0} />
                <AIInputLoader key="loader2" isTriggered={isActive} hideButton startDelay={200} />
                <AIInputLoader key="loader3" isTriggered={isActive} hideButton startDelay={400} />
                <AIInputLoader key="loader4" isTriggered={isActive} hideButton startDelay={600} />
            </div>
            <div className={styles.buttonContainer}>
                <button 
                    className={styles.activateButton} 
                    onClick={handleActivate}
                    disabled={isActive}
                >
                    Activate All Loaders
                </button>
            </div>
        </div>
    );
} 