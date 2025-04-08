'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { PageLayout } from '../../layouts/PageLayout';
import styles from './page.module.css';

export default function StatesPage() {
    return (
        <PageLayout>
            <div className={styles.lottieContainer}>
                <div className={styles.lottieWrapper}>
                    <h3>Open State</h3>
                    <DotLottieReact
                        src="/assets/avatar-open.lottie"
                        autoplay
                        loop
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
                <div className={styles.lottieWrapper}>
                    <h3>Repeat State</h3>
                    <DotLottieReact
                        src="/assets/avatar-repeat.lottie"
                        autoplay
                        loop
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
                <div className={styles.lottieWrapper}>
                    <h3>Close State</h3>
                    <DotLottieReact
                        src="/assets/avatar-close.lottie"
                        autoplay
                        loop
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>
            </div>
        </PageLayout>
    );
} 