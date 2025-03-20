'use client';

import React, { useState, useEffect } from 'react';
import styles from './AIInputLoader.module.css';
import docStyles from '@/app/styles/documentation.module.css';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';

export interface BaseAIInputLoaderProps {
    onThinkingComplete?: () => void;
    width?: number;
    height?: number;
    isTriggered?: boolean;
    hideButton?: boolean;
    startDelay?: number;
    variant: 'looping' | 'shimmer';
    shouldReset?: boolean;
}

const placeholderSequence = [
    { text: "Connecting to database", duration: 1000 },
    { text: "Sampling data", duration: 2000 },
    { text: "Generating description", duration: 2000 }
];

const FINAL_TEXT = "Size of wheels being placed on bikes within the store inventory";

export function BaseAIInputLoader({
    onThinkingComplete,
    width = 440,
    height = 120,
    isTriggered = false,
    hideButton = false,
    startDelay = 0,
    variant = 'looping',
    shouldReset = false
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
        if (isTriggered && !isThinking && !isOutput) {
            timer = setTimeout(() => {
                toggleThinking();
            }, startDelay);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isTriggered, isThinking, isOutput]);

    const toggleThinking = async () => {
        // Don't proceed if already in thinking or output state
        if (isThinking || isOutput) return;

        setIsThinking(true);
        setCurrentPlaceholder("");
        setStatusText(placeholderSequence[0].text);
        const ellipsisInterval = animateEllipsis();
        
        try {
            // Skip the first status text since we've already set it
            for (let i = 1; i < placeholderSequence.length; i++) {
                const step = placeholderSequence[i];
                await new Promise(resolve => setTimeout(resolve, step.duration));
                setStatusText(step.text);
            }

            await new Promise(resolve => setTimeout(resolve, 5000));
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
                    {(!isThinking && !isOutput && !isTriggered) ? (
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
                    className={`${styles.thinkingOutline} ${(variant === 'looping' && isThinking) ? styles.thinking : ''} ${isOutput ? styles.output : ''}`}
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
            </div>
            {!hideButton && (
                <div className={docStyles.buttonContainer}>
                    <a
                        href={`/loading-states/ai-input-loader/in-situ?variant=${variant}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={docStyles.viewButton}
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
                            className={docStyles.externalIcon}
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                    <a
                        href={`/loading-states/ai-input-loader/in-situ?variant=${variant}&tab=details`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={docStyles.viewButton}
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
                            className={docStyles.externalIcon}
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
} 