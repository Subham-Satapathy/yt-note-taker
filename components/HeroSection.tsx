'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Turn any YouTube video into instant summaries
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
              Paste videos, get instant AI-powered summaries. Built for professionals, students, and content creators who value their time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href={session ? "/summarize" : "/auth/signup"} className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-center">
                Get started
              </Link>
              <a href="#features" className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center">
                Learn more
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center order-first lg:order-last">
            <img 
              src="/undraw_online-learning_tgmv.svg" 
              alt="YouTube video summarizer - AI-powered note taking" 
              className="w-full h-auto max-w-md lg:max-w-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
