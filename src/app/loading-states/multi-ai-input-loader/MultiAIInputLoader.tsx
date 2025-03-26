'use client';

import React, { useState, useEffect } from 'react';
import multiStyles from './MultiAIInputLoader.module.css';
import aiStyles from '../ai-input-loader/AIInputLoader.module.css';
import { AnimatedAvatar } from '@/app/components/AnimatedAvatar';

interface MultiAIInputLoaderProps {
    onThinkingComplete?: () => void;
    isTriggered?: boolean;
    variant?: 'looping' | 'shimmer';
    shouldReset?: boolean;
    count?: number;
    hideTracer?: boolean;
    selectedDuration?: 'P50' | 'P75' | 'P95';
}

const getGeneratingDuration = (selectedDuration: 'P50' | 'P75' | 'P95' | undefined) => {
    switch (selectedDuration) {
        case 'P75': return 6000; // 2000 + 4000 additional
        case 'P95': return 35000; // 2000 + 33000 additional
        default: return 2000; // Default P50 duration
    }
};

export const MultiAIInputLoader: React.FC<MultiAIInputLoaderProps> = ({
    onThinkingComplete,
    isTriggered = false,
    variant = 'looping',
    shouldReset = false,
    count = 5,
    hideTracer = false,
    selectedDuration,
}) => {
    const [isThinking, setIsThinking] = useState(false);
    const [isOutput, setIsOutput] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [currentPlaceholders, setCurrentPlaceholders] = useState<string[]>(Array(count).fill(''));
    const [statusText, setStatusText] = useState('Connecting to database');

    const placeholderSequence = [
        { text: 'Connecting to database', duration: 1000 },
        { text: 'Sampling data', duration: 1500 },
        { text: 'Generating descriptions', duration: getGeneratingDuration(selectedDuration) }
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
            setStatusText('Connecting to database');
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
                setStatusText('Connecting to database');
            }
            // Start the animation
            setIsThinking(true);
            animatePlaceholders();
        }
    }, [isTriggered]);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const animatePlaceholders = async () => {
        // Match AIInputLoader's timing exactly
        for (const { text, duration } of placeholderSequence) {
            setStatusText(text);
            await sleep(duration);
        }

        setStatusText('CORTEX-GENERATED DESCRIPTION');
        
        // Start fade out of skeleton shimmer
        setIsFadingOut(true);
        await sleep(400); // Match AIInputLoader's fade out duration
        
        // Complete the transition
        setIsThinking(false);
        setIsOutput(true);
        
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
                    {isThinking && <span className={multiStyles.ellipsis}></span>}
                </span>
            </div>
            <div className={multiStyles.inputsContainer}>
                {finalTexts.map((_, index) => (
                    <div key={index} className={multiStyles.inputWrapper}>
                        <textarea
                            className={`${aiStyles.styledInput} ${isThinking ? aiStyles.thinking : ''} ${isOutput ? aiStyles.output : ''}`}
                            value={currentPlaceholders[index]}
                            readOnly
                            style={{ 
                                width: '440px',
                                height: '72px', 
                                resize: 'none',
                                padding: '16px'
                            }}
                        />
                        {!hideTracer && (
                            <svg
                                className={`${aiStyles.thinkingOutline} ${variant === 'looping' ? (isThinking ? aiStyles.thinking : '') : ''} ${isOutput ? aiStyles.output : ''}`}
                                width={440}
                                height={72}
                            >
                                <defs>
                                    <linearGradient 
                                        id={`loading-gradient-${index}`}
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
                                    </linearGradient>
                                    <radialGradient 
                                        id={`completed-gradient-${index}`} 
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
                                    className={aiStyles.outlinePath}
                                    width={440}
                                    height={72}
                                    rx="6"
                                    ry="6"
                                />
                                <rect
                                    className={aiStyles.basePath}
                                    width={440}
                                    height={72}
                                    rx="6"
                                    ry="6"
                                />
                                <rect
                                    className={aiStyles.gradientPath}
                                    width={440}
                                    height={72}
                                    rx="6"
                                    ry="6"
                                />
                            </svg>
                        )}
                        {isThinking && !isOutput && (
                            <div 
                                className={aiStyles.skeletonContainer}
                                style={{ 
                                    opacity: isFadingOut ? 0 : 1,
                                    transition: 'opacity 0.3s ease',
                                    top: '16px',
                                    left: '16px',
                                    right: '16px'
                                }}
                            >
                                <div className={`${aiStyles.skeletonLine} ${aiStyles.shimmer}`}></div>
                                <div className={`${aiStyles.skeletonLine} ${aiStyles.shimmer}`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}