'use client';

import React from 'react';
import styles from './ControlBar.module.css';

interface ControlBarProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function ControlBar({ title = 'Controls', children, className }: ControlBarProps) {
    return (
        <div className={`${styles.controlBar} ${className || ''}`}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
} 