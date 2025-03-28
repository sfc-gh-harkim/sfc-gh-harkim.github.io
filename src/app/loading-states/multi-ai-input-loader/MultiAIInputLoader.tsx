'use client';

import React, { useState, useEffect } from 'react';
import multiStyles from './MultiAIInputLoader.module.css';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';

interface MultiAIInputLoaderProps {
    onThinkingComplete?: () => void;
    isTriggered?: boolean;
    shouldReset?: boolean;
    count?: number;
    hideTracer?: boolean;
    selectedDuration?: 'P50' | 'P75' | 'P95';
}

const getGeneratingDuration = (selectedDuration: 'P50' | 'P75' | 'P95' | undefined) => {
    switch (selectedDuration) {
        case 'P75': return 10500; // For 15s total (2000ms + 2000ms + remaining time)
        case 'P95': return 33500; // For 38s total (2000ms + 2000ms + remaining time)
        default: return 500; // For 5s total (2000ms + 2000ms + remaining time)
    }
};

export const MultiAIInputLoader: React.FC<MultiAIInputLoaderProps> = ({
    onThinkingComplete,
    isTriggered = false,
    shouldReset = false,
    count = 5,
    hideTracer = false,
    selectedDuration,
}) => {
    const [isThinking, setIsThinking] = useState(false);
    const [isOutput, setIsOutput] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [currentPlaceholders, setCurrentPlaceholders] = useState<string[]>(Array(count).fill(''));
    const [statusText, setStatusText] = useState("");
    const [ellipsis, setEllipsis] = useState('');
    
    // Generate unique IDs for this instance
    const instanceId = React.useId();

    const animateEllipsis = () => {
        let count = 0;
        const interval = setInterval(() => {
            count = (count + 1) % 4;
            setEllipsis(count === 0 ? '' : '.'.repeat(count));
        }, 300);
        return interval;
    };

    const placeholderSequence = [
        { text: "Searching data sources", duration: 2000 },
        { text: "Processing information", duration: 3000 },
        { text: "Generating description", duration: getGeneratingDuration(selectedDuration) }
    ];

    const finalTexts = [
        'Size of wheels being placed on bikes within the store inventory',
        'Color of bikes within the store inventory',
        'Category of bikes within the store inventory',
        'Size of the bicycle frames on bikes within the store inventory',
        'Date bike was purchased'
    ];

    useEffect(() => {
        if (shouldReset) {
            setIsThinking(false);
            setIsOutput(false);
            setIsFadingOut(false);
            setCurrentPlaceholders(Array(count).fill(''));
            setStatusText("");
            setEllipsis('');
        }
    }, [shouldReset, count]);

    useEffect(() => {
        if (isTriggered) {
            if (isOutput) {
                // Reset states if already completed
                setIsThinking(false);
                setIsOutput(false);
                setIsFadingOut(false);
                setCurrentPlaceholders(Array(count).fill(''));
                setStatusText("");
                setEllipsis('');
            }
            // Start the animation
            setIsThinking(true);
            const ellipsisInterval = animateEllipsis();
            animatePlaceholders();
            return () => clearInterval(ellipsisInterval);
        }
    }, [isTriggered]);

    useEffect(() => {
        if (isThinking && !isOutput) {
            setStatusText(statusText.replace(/\.+$/, '') + ellipsis);
        }
    }, [ellipsis, isThinking, isOutput, statusText]);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const animatePlaceholders = async () => {
        // Match AIInputLoader's timing exactly
        for (const { text, duration } of placeholderSequence) {
            setStatusText(text);
            await sleep(duration);
        }

        // Complete the transition before setting final status
        setIsThinking(false);
        setIsOutput(true);
        setStatusText('CORTEX-GENERATED DESCRIPTION');
        
        // Start fade out of skeleton shimmer
        setIsFadingOut(true);
        await sleep(400); // Match AIInputLoader's fade out duration
        
        // Start staggered output animations
        await typeText();
        
        // Wait for output glow to complete before fading out
        await sleep(1000); // Wait for glow animation to complete
        
        onThinkingComplete?.();
    };

    const typeText = async () => {
        // Create separate typing animations for each text area
        const typePromises = finalTexts.slice(0, 5).map(async (text, index) => {
            // Add stagger effect for each item after the first
            if (index > 0) {
                await sleep(400 * index);
            }
            
            // Match AIInputLoader's typing speed
            for (let i = 0; i <= text.length; i++) {
                setCurrentPlaceholders(prev => {
                    const newPlaceholders = [...prev];
                    newPlaceholders[index] = text.slice(0, i);
                    return newPlaceholders;
                });
                await sleep(20);
            }
        });

        // Wait for all typing animations to complete
        await Promise.all(typePromises);
    };

    return (
        <div className={multiStyles.container}>
            <div className={multiStyles.statusTextContainer}>
                <div className={multiStyles.avatarContainer}>
                    <AnimatedAvatar 
                        width={20} 
                        height={20}
                        isPlaying={isThinking}
                        isOutput={isOutput}
                    />
                </div>
                <span className={multiStyles.statusText}>
                    {statusText}
                    {isThinking && !isOutput && <span className={multiStyles.ellipsis}></span>}
                </span>
            </div>
            <div className={multiStyles.inputsContainer}>
                {finalTexts.map((_, index) => (
                    <div key={index} className={multiStyles.inputWrapper}>
                        <textarea
                            className={`${multiStyles.styledInput} ${isThinking ? multiStyles.thinking : ''} ${isOutput ? multiStyles.output : ''}`}
                            value={currentPlaceholders[index]}
                            readOnly
                            style={{ 
                                width: '100%',
                                height: '72px', 
                                resize: 'none',
                                padding: '16px'
                            }}
                        />
                        {!hideTracer && (
                            <svg
                                className={`${multiStyles.thinkingOutline} ${isThinking ? multiStyles.thinking : ''} ${isOutput ? multiStyles.output : ''}`}
                                width="100%"
                                height={72}
                            >
                                <defs>
                                    <linearGradient 
                                        id={`loading-gradient-${instanceId}-${index}`}
                                        gradientUnits="userSpaceOnUse"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="0%"
                                    >
                                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
                                    </linearGradient>
                                    <radialGradient 
                                        id={`completed-gradient-${instanceId}-${index}`} 
                                        cx="50%" 
                                        cy="50%" 
                                        r="100%" 
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop offset="0%" stopColor="#2986E8" />
                                        <stop offset="33%" stopColor="#90E0FD" />
                                        <stop offset="66%" stopColor="#11C5CF" />
                                        <stop offset="100%" stopColor="#2986E8" />
                                    </radialGradient>
                                </defs>
                                <rect
                                    className={multiStyles.outlinePath}
                                    width="100%"
                                    height={72}
                                    rx="6"
                                    ry="6"
                                    style={{ stroke: `url(#completed-gradient-${instanceId}-${index})` }}
                                />
                                <rect
                                    className={multiStyles.basePath}
                                    width="100%"
                                    height={72}
                                    rx="6"
                                    ry="6"
                                    style={{ stroke: `url(#completed-gradient-${instanceId}-${index})` }}
                                />
                                <rect
                                    className={multiStyles.gradientPath}
                                    width="100%"
                                    height={72}
                                    rx="6"
                                    ry="6"
                                    style={{ stroke: `url(#loading-gradient-${instanceId}-${index})` }}
                                />
                            </svg>
                        )}
                        {isThinking && !isOutput && (
                            <div 
                                className={multiStyles.skeletonContainer}
                                style={{ 
                                    opacity: isFadingOut ? 0 : 1,
                                    transition: 'opacity 0.3s ease',
                                    top: '16px',
                                    left: '16px',
                                    right: '16px'
                                }}
                            >
                                <div className={`${multiStyles.skeletonLine} ${multiStyles.shimmer}`}></div>
                                <div className={`${multiStyles.skeletonLine} ${multiStyles.shimmer}`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}