'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

interface AnimatedAvatarProps {
    width?: number;
    height?: number;
    className?: string;
    isPlaying?: boolean;
    isStopping?: boolean;
    isOutput?: boolean;
}

export function AnimatedAvatar({ 
    width = 200, 
    height = 200,
    className,
    isPlaying: externalIsPlaying,
    isStopping: externalIsStopping,
    isOutput: externalIsOutput
}: AnimatedAvatarProps) {
    const [currentAnimation, setCurrentAnimation] = useState<'open' | 'repeat' | 'close'>('open');
    const [isPlaying, setIsPlaying] = useState(false);
    const [shouldLoop, setShouldLoop] = useState(false);
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
    const [isStopping, setIsStopping] = useState(false);

    // Handle external state changes
    useEffect(() => {
        if (externalIsPlaying !== undefined) {
            setIsPlaying(externalIsPlaying);
        }
        if (externalIsStopping !== undefined) {
            setIsStopping(externalIsStopping);
        }
        if (externalIsOutput) {
            setCurrentAnimation('close');
            setShouldLoop(false);
        }
    }, [externalIsPlaying, externalIsStopping, externalIsOutput]);

    // Auto-play when mounted (only if no external control)
    useEffect(() => {
        if (externalIsPlaying === undefined) {
            setIsPlaying(true);
            setShouldLoop(true);
            setCurrentAnimation('open');
            setIsStopping(false);
        }
    }, [externalIsPlaying]);

    const handleComplete = useCallback(() => {
        // If we're stopping and just finished a repeat cycle, transition to close
        if (isStopping && currentAnimation === 'repeat') {
            setCurrentAnimation('close');
            setShouldLoop(false);
            setIsStopping(false);
            return;
        }

        if (currentAnimation === 'open') {
            // When open animation completes, immediately start repeat
            setCurrentAnimation('repeat');
            setShouldLoop(true);
            if (dotLottie) {
                dotLottie.play();
            }
        } else if (currentAnimation === 'close') {
            setCurrentAnimation('open');
            setIsPlaying(false);
            setShouldLoop(false);
        }
    }, [currentAnimation, isStopping, dotLottie]);

    // Handle animation loading and state changes
    useEffect(() => {
        if (!dotLottie) return;

        const handleLoad = () => {
            if (isPlaying || currentAnimation === 'close') {
                dotLottie.play();
            }
        };

        // Add event listeners
        dotLottie.addEventListener('complete', handleComplete);
        dotLottie.addEventListener('load', handleLoad);

        // Handle initial state or animation changes
        if (!isPlaying && currentAnimation === 'open') {
            dotLottie.setFrame(0);
            dotLottie.pause();
        } else {
            dotLottie.play();
        }

        return () => {
            dotLottie.removeEventListener('complete', handleComplete);
            dotLottie.removeEventListener('load', handleLoad);
        };
    }, [dotLottie, handleComplete, isPlaying, currentAnimation]);

    const dotLottieRefCallback = (ref: DotLottie | null) => {
        setDotLottie(ref);
        if (ref) {
            ref.setFrame(0);
            ref.pause();
        }
    };

    return (
        <div className={className} style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width,
            height
        }}>
            <DotLottieReact
                key={currentAnimation} // Force remount on animation change
                src={`/assets/avatar-${currentAnimation}.lottie`}
                autoplay={isPlaying || currentAnimation === 'close'}
                loop={shouldLoop}
                dotLottieRefCallback={dotLottieRefCallback}
                style={{ width, height }}
            />
        </div>
    );
} 