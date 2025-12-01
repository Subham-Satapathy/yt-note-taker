'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HeroSection() {
  const { data: session } = useSession();

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
              <Link href={session ? "/summarize" : "/auth/signup"} className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                Get started
              </Link>
              <a href="#features" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                Learn more
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="/undraw_online-learning_tgmv.svg" 
              alt="Online learning illustration" 
              className="w-full h-auto max-w-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
