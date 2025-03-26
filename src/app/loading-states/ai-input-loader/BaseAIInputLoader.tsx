'use client';

import React, { useState, useEffect } from 'react';
import styles from './AIInputLoader.module.css';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';

export interface BaseAIInputLoaderProps {
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
        case 'P75': return 6000; // 2000 + 4000 additional
        case 'P95': return 35000; // 2000 + 33000 additional
        default: return 2000; // Default P50 duration
    }
};

const placeholderSequence = [
    { text: "Connecting to database", duration: 1000 },
    { text: "Sampling data", duration: 2000 }
];

const FINAL_TEXT = "Size of wheels being placed on bikes within the store inventory";

export function BaseAIInputLoader({
    onThinkingComplete,
    onGenerateClick,
    width = 440,
    height = 120,
    isTriggered = false,
    startDelay = 0,
    variant = 'looping',
    shouldReset = false,
    selectedDuration
}: BaseAIInputLoaderProps) {
    const [isThinking, setIsThinking] = useState(false);
    const [isOutput, setIsOutput] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [statusText, setStatusText] = useState("");
    const [ellipsis, setEllipsis] = useState('');

    const animateEllipsis = () => {
        let count = 0;
        const interval = setInterval(() => {
            count = (count + 1) % 4;
            setEllipsis(count === 0 ? '' : '.'.repeat(count));
        }, 300);
        return interval;
    };

    const typeText = async (text: string) => {
        let currentText = "";
        for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            setCurrentPlaceholder(currentText);
            await new Promise(resolve => setTimeout(resolve, 30));
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
                // Reset states if already completed
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
        // Reset states if already completed
        if (isOutput) {
            setIsThinking(false);
            setIsOutput(false);
            setCurrentPlaceholder("");
            setStatusText("");
            setEllipsis('');
            // Start the animation again
            onGenerateClick?.();
            setIsThinking(true);
            const ellipsisInterval = animateEllipsis();
            
            try {
                // Go through initial states
                for (const step of placeholderSequence) {
                    setStatusText(step.text);
                    await new Promise(resolve => setTimeout(resolve, step.duration));
                }

                // Set the "Generating description" state with dynamic duration
                setStatusText("Generating description");
                await new Promise(resolve => setTimeout(resolve, getGeneratingDuration(selectedDuration)));

                clearInterval(ellipsisInterval);
                setIsThinking(false);
                setIsOutput(true);
                setEllipsis('');
                setStatusText("Cortex-Generated");
                await typeText(FINAL_TEXT);
                onThinkingComplete?.();
            } catch {
                clearInterval(ellipsisInterval);
                setIsThinking(false);
                setIsOutput(false);
            }
            return;
        }

        // Don't proceed if already in thinking state
        if (isThinking) return;

        onGenerateClick?.();
        setIsThinking(true);
        setCurrentPlaceholder("");
        const ellipsisInterval = animateEllipsis();
        
        try {
            // Go through initial states
            for (const step of placeholderSequence) {
                setStatusText(step.text);
                await new Promise(resolve => setTimeout(resolve, step.duration));
            }

            // Set the "Generating description" state with dynamic duration
            setStatusText("Generating description");
            await new Promise(resolve => setTimeout(resolve, getGeneratingDuration(selectedDuration)));

            clearInterval(ellipsisInterval);
            setIsThinking(false);
            setIsOutput(true);
            setEllipsis('');
            setStatusText("Cortex-Generated");
            await typeText(FINAL_TEXT);
            onThinkingComplete?.();
        } catch {
            clearInterval(ellipsisInterval);
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
                {variant === 'shimmer' && (
                    <div 
                        className={styles.skeletonContainer}
                        style={{ opacity: isThinking && !isOutput ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    >
                        <div className={`${styles.skeletonLine} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.shimmer}`}></div>
                    </div>
                )}
                {variant === 'combined' && (
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