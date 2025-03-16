'use client';

import React, { useState, useEffect } from 'react';
import styles from './AIInputLoader.module.css';

interface AIInputLoaderProps {
    placeholder?: string;
    onThinkingComplete?: () => void;
    width?: number;
    height?: number;
    isTriggered?: boolean;
    hideButton?: boolean;
    startDelay?: number;
}

const placeholderSequence = [
    { text: "Connecting to database", duration: 1000 },
    { text: "Sampling data", duration: 2000 },
    { text: "Generating description", duration: 2000 }
];

const FINAL_TEXT = "Size of wheels being placed on bikes within the store inventory";

export const AIInputLoader: React.FC<AIInputLoaderProps> = ({
    placeholder = "...",
    onThinkingComplete,
    width = 440,
    height = 120,
    isTriggered = false,
    hideButton = false,
    startDelay = 0
}) => {
    const [isThinking, setIsThinking] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
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

    const animatePlaceholder = async () => {
        for (const step of placeholderSequence) {
            await new Promise(resolve => setTimeout(resolve, step.duration));
            setCurrentPlaceholder(step.text);
        }
    };

    useEffect(() => {
        if (isThinking && !isDone) {
            setCurrentPlaceholder(currentPlaceholder.replace(/\.+$/, '') + ellipsis);
        }
    }, [ellipsis, isThinking, isDone, currentPlaceholder]);

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
            setCurrentPlaceholder(placeholder);
            setEllipsis('');
            return;
        }

        setIsThinking(true);
        const ellipsisInterval = animateEllipsis();
        await animatePlaceholder();

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
                <textarea
                    className={`${styles.styledInput} ${isThinking ? styles.thinking : ''} ${isDone ? styles.done : ''}`}
                    value={currentPlaceholder}
                    readOnly
                    style={{ width, height, resize: 'none' }}
                />
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
            </div>
            {!hideButton && (
                <div className={styles.buttonContainer}>
                    <button className={styles.toggleButton} onClick={toggleThinking}>
                        Activate Loader
                    </button>
                </div>
            )}
        </div>
    );
};

export default AIInputLoader; 