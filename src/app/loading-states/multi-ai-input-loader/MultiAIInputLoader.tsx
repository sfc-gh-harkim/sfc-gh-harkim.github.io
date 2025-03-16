'use client';

import React, { useState } from 'react';
import { AIInputLoader } from '@/app/loading-states/ai-input-loader/AIInputLoader';

export interface MultiAIInputLoaderProps {
    count?: number;
}

export const MultiAIInputLoader: React.FC<MultiAIInputLoaderProps> = ({ count = 3 }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Array.from({ length: count }, (_, index) => (
                    <AIInputLoader
                        key={index}
                        isTriggered={isActive}
                        hideButton={true}
                        startDelay={index * 200}
                    />
                ))}
            </div>
            <div className="mt-8 flex justify-center">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setIsActive(prev => !prev)}
                >
                    {isActive ? 'Reset' : 'Start All'}
                </button>
            </div>
        </div>
    );
};

export default MultiAIInputLoader; 