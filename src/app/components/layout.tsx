'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const components = [
    { name: 'AIInputLoader', path: '/components/ai-input-loader' },
    { name: 'Multi AI Input Loader', path: '/components/multi-ai-input-loader' },
    // Add more components here as they are created
];

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 p-6">
                <Link href="/" className="block mb-6">
                    <h2 className="text-xl font-bold text-gray-100 hover:text-blue-400 transition-colors">Design Lab</h2>
                </Link>
                <nav>
                    <ul className="space-y-2">
                        {components.map((component) => (
                            <li key={component.path}>
                                <Link
                                    href={component.path}
                                    className={`block px-4 py-2 rounded-md transition-colors ${
                                        pathname === component.path
                                            ? 'bg-blue-900 text-blue-400'
                                            : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {component.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
} 