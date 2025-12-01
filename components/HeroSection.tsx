import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Turn any YouTube video into instant summaries
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Paste videos, get instant AI-powered summaries. Built for professionals, students, and content creators who value their time.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/signup" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                Get started
              </Link>
              <a href="#features" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                Learn more
              </a>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
