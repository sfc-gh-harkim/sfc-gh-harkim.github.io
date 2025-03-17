'use client';

import React, { useEffect, useState } from 'react';
import { BaseAIInputLoader } from '../BaseAIInputLoader';
import styles from './page.module.css';

export default function InSituPage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [variant, setVariant] = useState<'looping' | 'shimmer'>('looping');

    useEffect(() => {
        // Get the variant from the URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const variantParam = urlParams.get('variant');
        if (variantParam === 'shimmer' || variantParam === 'looping') {
            setVariant(variantParam);
        }

        // Show modal after 1 second
        const timer = setTimeout(() => {
            setIsModalVisible(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            window.close();
        }, 500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.backdrop}>
                <img 
                    src="/assets/loader-single-column-desc.png" 
                    alt="Snowflake UI Database Column Description"
                    className={styles.backdropImage}
                />
            </div>
            <div className={`${styles.modal} ${isModalVisible ? styles.visible : ''}`}>
                <div className={styles.modalContent}>
                    <BaseAIInputLoader
                        variant={variant}
                        hideButton={true}
                        isTriggered={true}
                        startDelay={500}
                    />
                    <div className={styles.buttonContainer}>
                        <button 
                            className={styles.cancelButton}
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className={styles.saveButton}
                            onClick={handleClose}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 