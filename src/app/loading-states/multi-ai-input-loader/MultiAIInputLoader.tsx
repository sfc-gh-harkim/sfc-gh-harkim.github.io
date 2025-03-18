'use client';

import React, { useState } from 'react';
import { BaseAIInputLoader } from '@/app/loading-states/ai-input-loader/BaseAIInputLoader';

export interface MultiAIInputLoaderProps {
    count?: number;
}

export const MultiAIInputLoader: React.FC<MultiAIInputLoaderProps> = ({ count = 3 }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Array.from({ length: count }, (_, index) => (
                    <BaseAIInputLoader
                        key={index}
                        isTriggered={isActive}
                        hideButton={true}
                        startDelay={index * 200}
                        variant="shimmer"
                    />
                ))}
            </div>
            <div className="mt-8 flex justify-center">
                <button
                    className="px-4 py-2 bg-transparent text-white border border-white rounded hover:bg-white/10 transition-colors"
                    onClick={() => setIsActive(prev => !prev)}
                >
                    {isActive ? 'Reset' : 'Start All'}
                </button>
            </div>
        </div>
    );
};

export default MultiAIInputLoader; 