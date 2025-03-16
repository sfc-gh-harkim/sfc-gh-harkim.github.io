'use client';

import { AIInputLoader } from '@/components/ai-input-loader';

export default function AIInputLoaderPage() {
    return (
        <div className="h-full flex items-center justify-center bg-gray-900">
            <AIInputLoader 
                onThinkingComplete={() => console.log('Thinking complete!')}
            />
        </div>
    );
}   