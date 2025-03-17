'use client';

import React, { useState, useEffect } from 'react';
import styles from './AIInputLoader.module.css';

interface BaseAIInputLoaderProps {
    onThinkingComplete?: () => void;
    width?: number;
    height?: number;
    isTriggered?: boolean;
    hideButton?: boolean;
    startDelay?: number;
    variant: 'looping' | 'shimmer';
}

const placeholderSequence = [
    { text: "Connecting to database", duration: 1000 },
    { text: "Sampling data", duration: 2000 },
    { text: "Generating description", duration: 2000 }
];

const FINAL_TEXT = "Size of wheels being placed on bikes within the store inventory";

export const BaseAIInputLoader: React.FC<BaseAIInputLoaderProps> = ({
    onThinkingComplete,
    width = 440,
    height = 120,
    isTriggered = false,
    hideButton = false,
    startDelay = 0,
    variant
}) => {
    const [isThinking, setIsThinking] = useState(false);
    const [isDone, setIsDone] = useState(false);
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
        setStatusText("Cortex-Generated");
    };

    useEffect(() => {
        if (isThinking && !isDone) {
            setStatusText(statusText.replace(/\.+$/, '') + ellipsis);
        }
    }, [ellipsis, isThinking, isDone, statusText]);

    useEffect(() => {
        if (isTriggered && !isThinking && !isDone) {
            const timer = setTimeout(() => {
                toggleThinking();
            }, startDelay);
            return () => clearTimeout(timer);
        }
    }, [isTriggered]);

    const toggleThinking = async () => {
        if (isThinking || isDone) {
            setIsThinking(false);
            setIsDone(false);
            setCurrentPlaceholder("");
            setStatusText("");
            setEllipsis('');
            return;
        }

        setIsThinking(true);
        setCurrentPlaceholder("");
        setStatusText(placeholderSequence[0].text);
        const ellipsisInterval = animateEllipsis();
        
        // Skip the first status text since we've already set it
        for (let i = 1; i < placeholderSequence.length; i++) {
            const step = placeholderSequence[i];
            await new Promise(resolve => setTimeout(resolve, step.duration));
            setStatusText(step.text);
        }

        setTimeout(async () => {
            clearInterval(ellipsisInterval);
            setIsThinking(false);
            setIsDone(true);
            setEllipsis('');
            await typeText(FINAL_TEXT);
            onThinkingComplete?.();
        }, 5000);
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer} style={{ width, height }}>
                <div className={styles.statusTextContainer}>
                    {!isThinking && !isDone ? (
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
                        <span className={styles.statusText}>{statusText}</span>
                    )}
                </div>
                <textarea
                    className={`${styles.styledInput} ${isThinking ? styles.thinking : ''} ${isDone ? styles.done : ''}`}
                    value={currentPlaceholder}
                    readOnly
                    style={{ width, height, resize: 'none' }}
                />
                {variant === 'looping' && (
                    <svg
                        className={`${styles.thinkingOutline} ${isThinking ? styles.thinking : ''} ${isDone ? styles.done : ''}`}
                        width={width}
                        height={height}
                    >
                        <defs>
                            <linearGradient id="loading-gradient" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90)">
                                <stop offset="0%" stopColor="#2986E8" stopOpacity="1" />
                                <stop offset="50%" stopColor="#2986E8" stopOpacity="1" />
                                <stop offset="100%" stopColor="#2986E8" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="completed-gradient" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#2986E8" />
                                <stop offset="50%" stopColor="#90E0FD" />
                                <stop offset="75%" stopColor="#11C5CF" />
                                <stop offset="100%" stopColor="#2986E8" />
                            </linearGradient>
                        </defs>
                        <rect
                            className={styles.outlinePath}
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
                )}
                {variant === 'shimmer' && (
                    <div 
                        className={styles.skeletonContainer}
                        style={{ opacity: isThinking && !isDone ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    >
                        <div className={`${styles.skeletonLine} ${styles.shimmer}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.shimmer}`}></div>
                    </div>
                )}
            </div>
            {!hideButton && (
                <div className={styles.buttonContainer}>
                    <a
                        href={`/loading-states/ai-input-loader/in-situ?variant=${variant}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewButton}
                    >
                        View In Situ
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
            )}
        </div>
    );
}; 