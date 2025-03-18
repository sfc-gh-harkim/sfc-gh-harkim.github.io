'use client';

import { BaseAIInputLoader } from '../BaseAIInputLoader';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';

export default function SingleObjectPage() {
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') as 'looping' | 'shimmer' || 'looping';

    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <BaseAIInputLoader variant={variant} hideButton />
            </div>
        </div>
    );
} 