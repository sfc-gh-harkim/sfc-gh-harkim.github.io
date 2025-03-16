import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-100 sm:text-5xl md:text-6xl">
            Design Lab
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A collection of beautiful, reusable React components built with Next.js and Tailwind CSS.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/components/ai-input-loader"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-blue-400 hover:bg-blue-300 md:py-4 md:text-lg md:px-10"
              >
                View Components
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-100 mb-8">Featured Components</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/components/ai-input-loader"
              className="relative group bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-100">AIInputLoader</h3>
                <p className="mt-2 text-sm text-gray-400">
                  An input field with an animated thinking state and dynamic placeholder text.
                </p>
              </div>
            </Link>
            {/* Add more component cards here as they are created */}
          </div>
        </div>
      </div>
    </main>
  );
}
