'use client';

import React, { useState, useEffect } from 'react';
import styles from './AIInputLoaderPerformant.module.css';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';

export interface BaseAIInputLoaderPerformantProps {
    onThinkingComplete?: () => void;
    onGenerateClick?: () => void;
    width?: number;
    height?: number;
    isTriggered?: boolean;
    startDelay?: number;
    variant: 'looping' | 'shimmer' | 'combined';
    shouldReset?: boolean;
    selectedDuration?: 'P50' | 'P75' | 'P95';
}

const getGeneratingDuration = (selectedDuration: 'P50' | 'P75' | 'P95' | undefined) => {
    switch (selectedDuration) {
        case 'P75': return 13500; // For 15s total (1000ms + remaining time)
        case 'P95': return 36500; // For 38s total (1000ms + remaining time)
        default: return 3500; // For 5s total (1000ms + remaining time)
    }
};

const FINAL_TEXT = "Size of wheels being placed on bikes within the store inventory";

export function BaseAIInputLoaderPerformant({
    onThinkingComplete,
    onGenerateClick,
    width = 440,
    height = 120,
    isTriggered = false,
    startDelay = 0,
    variant = 'looping',
    shouldReset = false,
    selectedDuration
}: BaseAIInputLoaderPerformantProps) {
    const [isThinking, setIsThinking] = useState(false);
    const [isOutput, setIsOutput] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [statusText, setStatusText] = useState("");
    const [ellipsis, setEllipsis] = useState('');

    const placeholderSequence = [
        { text: "Searching data sources", duration: 1000 },
        { text: "Generating description", duration: getGeneratingDuration(selectedDuration) }
    ];

    const animateEllipsis = () => {
        let count = 0;
        let lastTimestamp = 0;
        let animationFrameId: number;
        
        const updateEllipsis = (timestamp: number) => {
            if (!lastTimestamp || timestamp - lastTimestamp > 300) {
                count = (count + 1) % 4;
                setEllipsis(count === 0 ? '' : '.'.repeat(count));
                lastTimestamp = timestamp;
            }
            
            animationFrameId = requestAnimationFrame(updateEllipsis);
        };
        
        animationFrameId = requestAnimationFrame(updateEllipsis);
        
        return () => cancelAnimationFrame(animationFrameId);
    };

    const typeText = async (text: string) => {
        const BATCH_SIZE = 3;
        const TYPE_DELAY = 30;
        let currentText = "";
        
        for (let i = 0; i < text.length; i += BATCH_SIZE) {
            const batch = text.slice(i, Math.min(i + BATCH_SIZE, text.length));
            currentText += batch;
            setCurrentPlaceholder(currentText);
            await new Promise(resolve => setTimeout(resolve, TYPE_DELAY));
        }
    };

    useEffect(() => {
        if (isThinking && !isOutput) {
            setStatusText(statusText.replace(/\.+$/, '') + ellipsis);
        }
    }, [ellipsis, isThinking, isOutput, statusText]);

    useEffect(() => {
        if (shouldReset) {
            setIsThinking(false);
            setIsOutput(false);
            setCurrentPlaceholder("");
            setStatusText("");
            setEllipsis('');
        }
    }, [shouldReset]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTriggered) {
            if (isOutput) {
                setIsThinking(false);
                setIsOutput(false);
                setCurrentPlaceholder("");
                setStatusText("");
                setEllipsis('');
            }
            timer = setTimeout(() => {
                toggleThinking();
            }, startDelay);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isTriggered]);

    const toggleThinking = async () => {
        if (isOutput) {
            setIsThinking(false);
            setIsOutput(false);
            setCurrentPlaceholder("");
            setStatusText("");
            setEllipsis('');
            onGenerateClick?.();
            setIsThinking(true);
            const cancelEllipsis = animateEllipsis();
            
            try {
                for (const step of placeholderSequence) {
                    setStatusText(step.text);
                    await new Promise(resolve => setTimeout(resolve, step.duration));
                }

                cancelEllipsis();
                setIsThinking(false);
                setIsOutput(true);
                setEllipsis('');
                setStatusText("Cortex-Generated");
                await typeText(FINAL_TEXT);
                onThinkingComplete?.();
            } catch {
                cancelEllipsis();
                setIsThinking(false);
                setIsOutput(false);
            }
            return;
        }

        if (isThinking) return;

        onGenerateClick?.();
        setIsThinking(true);
        setCurrentPlaceholder("");
        const cancelEllipsis = animateEllipsis();
        
        try {
            for (const step of placeholderSequence) {
                setStatusText(step.text);
                await new Promise(resolve => setTimeout(resolve, step.duration));
            }

            cancelEllipsis();
            setIsThinking(false);
            setIsOutput(true);
            setEllipsis('');
            setStatusText("Cortex-Generated");
            await typeText(FINAL_TEXT);
            onThinkingComplete?.();
        } catch {
            cancelEllipsis();
            setIsThinking(false);
            setIsOutput(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer} style={{ width, height }}>
                <div className={styles.statusTextContainer}>
                    {(!isThinking && !isOutput) ? (
                        <span className={`${styles.statusText} ${styles.resting}`}>
                            Write a description or{' '}
                            <button 
                                onClick={toggleThinking}
                                className={styles.generateButton}
                            >
                                Generate with Cortex
                            </button>
                        </span>
                    ) : (
                        <>
                            <div className={styles.avatarContainer}>
                                <AnimatedAvatar 
                                    width={20} 
                                    height={20}
                                    isPlaying={isThinking}
                                    isOutput={isOutput}
                                />
                            </div>
                            <span className={styles.statusText}>{statusText}</span>
                        </>
                    )}
                </div>
                <textarea
                    className={`${styles.styledInput} ${isThinking ? styles.thinking : ''} ${isOutput ? styles.output : ''}`}
                    value={currentPlaceholder}
                    readOnly
                    style={{ width, height, resize: 'none' }}
                />
                
                <div className={styles.gradientCircleContainer}>
                    <div className={`${styles.gradientCircle} ${styles.primary}`}></div>
                    <div className={`${styles.gradientCircle} ${styles.secondary}`}></div>
                </div>
                
                <svg
                    className={`${styles.thinkingOutline} ${((variant === 'looping' || variant === 'combined') && isThinking) ? styles.thinking : ''} ${isOutput ? styles.output : ''}`}
                    width={width}
                    height={height}
                >
                    <defs>
                        <linearGradient 
                            id="loading-gradient" 
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
                        </linearGradient>
                        <radialGradient id="completed-gradient" cx="50%" cy="50%" r="100%" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#2986E8" />
                            <stop offset="33%" stopColor="#90E0FD" />
                            <stop offset="66%" stopColor="#11C5CF" />
                            <stop offset="100%" stopColor="#2986E8" />
                        </radialGradient>
                    </defs>
                    <rect
                        className={styles.outlinePath}
                        width={width}
                        height={height}
                        rx="6"
                        ry="6"
                    />
                    <rect
                        className={styles.basePath}
                        width={width}
                        height={height}
                        rx="6"
                        ry="6"
                    />
                    <rect
                        className={styles.gradientPath}
                        width={width}
                        height={height}
                        rx="6"
                        ry="6"
                    />
                </svg>
                
                {(variant === 'shimmer' || variant === 'combined') && (
                    <div 
                        className={styles.skeletonContainer}
                        style={{ opacity: isThinking && !isOutput ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    >
                        <div className={`${styles.skeletonLine} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.shimmer}`}></div>
                    </div>
                )}
            </div>
        </div>
    );
} 