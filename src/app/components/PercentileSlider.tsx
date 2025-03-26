'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './PercentileSlider.module.css';

interface PercentileSliderProps {
    activeValue: 'P50' | 'P75' | 'P95';
    onChange: (value: 'P50' | 'P75' | 'P95') => void;
    disabled?: boolean;
}

export function PercentileSlider({ activeValue, onChange, disabled = false }: PercentileSliderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const values: ('P50' | 'P75' | 'P95')[] = ['P50', 'P75', 'P95'];
    
    const getDisplayValue = (value: 'P50' | 'P75' | 'P95') => {
        switch (value) {
            case 'P50': return '5s';
            case 'P75': return '9s';
            case 'P95': return '38s';
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (disabled) return;
        setIsDragging(true);
        updateSliderPosition(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (disabled) return;
        if (isDragging) {
            updateSliderPosition(e);
        }
    };

    const handleMouseUp = () => {
        if (disabled) return;
        setIsDragging(false);
    };

    const updateSliderPosition = (e: React.MouseEvent | MouseEvent) => {
        if (disabled || !sliderRef.current) return;
        
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, x / width));
        
        // Snap to closest value
        const index = Math.round(percentage * 2);
        onChange(values[index]);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const currentIndex = values.indexOf(activeValue);
    const percentage = (currentIndex / 2) * 100;

    return (
        <div className={styles.container}>
            <div 
                ref={sliderRef}
                className={styles.slider}
                onMouseDown={handleMouseDown}
                data-disabled={disabled}
            >
                <div className={styles.track}>
                    <div 
                        className={styles.fill}
                        style={{ width: `${percentage}%` }}
                    />
                    <div className={styles.tickMark} />
                    <div className={styles.tickMark} />
                    <div className={styles.tickMark} />
                </div>
                <div 
                    className={styles.knob}
                    style={{ left: `${percentage}%` }}
                >
                    <div 
                        className={styles.valueLabel}
                        style={{ left: `${percentage}%` }}
                    >
                        {getDisplayValue(activeValue)}
                    </div>
                </div>
            </div>
        </div>
    );
} 