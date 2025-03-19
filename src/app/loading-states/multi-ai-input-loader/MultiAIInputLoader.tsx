'use client';

import React, { useState, useEffect, useCallback } from 'react';
import multiStyles from './MultiAIInputLoader.module.css';
import aiStyles from '../ai-input-loader/AIInputLoader.module.css';

interface MultiAIInputLoaderProps {
    onThinkingComplete?: () => void;
    width?: number;
    height?: number;
    isTriggered?: boolean;
    startDelay?: number;
    variant?: 'looping' | 'shimmer';
    shouldReset?: boolean;
    count?: number;
    hideTracer?: boolean;
}

export const MultiAIInputLoader: React.FC<MultiAIInputLoaderProps> = ({
    onThinkingComplete,
    width = 400,
    height = 72,
    isTriggered = false,
    startDelay = 0,
    variant = 'looping',
    shouldReset = false,
    count = 5,
    hideTracer = false
}) => {
    const [isThinking, setIsThinking] = useState(false);
    const [isOutput, setIsOutput] = useState(false);
    const [currentPlaceholders, setCurrentPlaceholders] = useState<string[]>(Array(count).fill(''));
    const [statusText, setStatusText] = useState('Connecting to database');

    const placeholderSequence = [
        { text: 'Connecting to database', duration: 1000 },
        { text: 'Sampling data', duration: 1500 },
        { text: 'Generating descriptions', duration: 2000 }
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
            setCurrentPlaceholders(Array(count).fill(''));
            setStatusText('Connecting to database');
        }
    }, [shouldReset, count]);

    useEffect(() => {
        if (isTriggered && !isThinking && !isOutput) {
            setIsThinking(true);
            animatePlaceholders();
        }
    }, [isTriggered]);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const animatePlaceholders = async () => {
        for (const { text, duration } of placeholderSequence) {
            setStatusText(text);
            await sleep(duration);
        }

        setStatusText('CORTEX-GENERATED DESCRIPTION');
        await typeText();
        setIsThinking(false);
        setIsOutput(true);
        onThinkingComplete?.();
    };

    const typeText = async () => {
        // Create separate typing animations for each text area
        const typePromises = finalTexts.slice(0, 5).map(async (text, index) => {
            // Wait for the staggered thinking state to complete
            await sleep(index * 200);
            
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
                                width: '600px',
                                height: '72px', 
                                resize: 'none',
                                animationDelay: `${startDelay + (index * 200)}ms`,
                                padding: '16px'
                            }}
                        />
                        {!hideTracer && (
                            <svg
                                className={`${aiStyles.thinkingOutline} ${variant === 'looping' ? (isThinking ? aiStyles.thinking : '') : ''} ${isOutput ? aiStyles.output : ''}`}
                                width={width}
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
                                    width={width}
                                    height={72}
                                    rx="6"
                                    ry="6"
                                />
                                <rect
                                    className={aiStyles.basePath}
                                    width={width}
                                    height={72}
                                    rx="6"
                                    ry="6"
                                />
                                <rect
                                    className={aiStyles.gradientPath}
                                    width={width}
                                    height={72}
                                    rx="6"
                                    ry="6"
                                />
                            </svg>
                        )}
                        {variant === 'shimmer' && (
                            <div 
                                className={aiStyles.skeletonContainer}
                                style={{ 
                                    opacity: isThinking && !isOutput ? 1 : 0, 
                                    transition: 'opacity 0.3s ease',
                                    animationDelay: `${startDelay + (index * 200)}ms`
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