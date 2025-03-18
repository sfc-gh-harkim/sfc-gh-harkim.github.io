'use client';

import { BaseAIInputLoader } from '../BaseAIInputLoader';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SingleObjectContent() {
    const searchParams = useSearchParams();
    const variant = searchParams.get('variant') as 'looping' | 'shimmer' || 'looping';
    
    return (
        <div style={{ padding: '2rem' }}>
            <BaseAIInputLoader variant={variant} />
        </div>
    );
}

export default function SingleObjectPage() {
    return (
        <Suspense>
            <SingleObjectContent />
        </Suspense>
    );
} 