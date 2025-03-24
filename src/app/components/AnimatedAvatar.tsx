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
    onComplete?: () => void;
}

export function AnimatedAvatar({ 
    width = 200, 
    height = 200,
    className,
    isPlaying = false,
    isStopping = false,
    isOutput = false,
    onComplete
}: AnimatedAvatarProps) {
    const [currentAnimation, setCurrentAnimation] = useState<'open' | 'repeat' | 'close'>('open');
    const [shouldLoop, setShouldLoop] = useState(false);
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

    // Handle external state changes
    useEffect(() => {
        if (isOutput) {
            setCurrentAnimation('close');
            setShouldLoop(false);
        }
    }, [isOutput]);

    // Handle stop state changes
    useEffect(() => {
        if (isStopping && currentAnimation === 'repeat') {
            setCurrentAnimation('close');
            setShouldLoop(false);
        }
    }, [isStopping, currentAnimation]);

    // Auto-play when mounted (only if no external control)
    useEffect(() => {
        if (isPlaying === undefined) {
            setShouldLoop(true);
            setCurrentAnimation('open');
        }
    }, [isPlaying]);

    const handleComplete = useCallback(() => {
        if (currentAnimation === 'open') {
            // When open animation completes, immediately start repeat
            setCurrentAnimation('repeat');
            setShouldLoop(true);
            if (dotLottie) {
                dotLottie.play();
            }
        } else if (currentAnimation === 'close') {
            setCurrentAnimation('open');
            onComplete?.();
        }
    }, [currentAnimation, dotLottie, onComplete]);

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