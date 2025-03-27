'use client';

import React from 'react';
import styles from '@/app/styles/designlab.module.css';

interface ControlBarProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function ControlBar({ title = 'Controls', children, className }: ControlBarProps) {
    return (
        <div className={`${styles.controlBar} ${className || ''}`}>
            <div className={styles.controlHeader}>
                <h2 className={styles.controlTitle}>{title}</h2>
            </div>
            <div className={styles.controlContent}>
                {children}
            </div>
        </div>
    );
} 