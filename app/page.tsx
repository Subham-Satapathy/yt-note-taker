'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import StepCard from '@/components/StepCard';
import TestimonialCard from '@/components/TestimonialCard';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      {/* Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              stepNumber="01 — Paste link"
              title="Drop your YouTube link and let it work"
              description="Just paste your link. Our YouTube link parser grabs the video. That's all you need to start."
            />
            <FeatureCard 
              stepNumber="02 — Fast output"
              title="Choose how much detail you need"
              description="Select from 50, 150, or 300 words. Get exactly the depth you want—no more or less."
            />
            <FeatureCard 
              stepNumber="03 — Get output"
              title="Receive your summary in seconds"
              description="Instant, AI-based summaries. Designed for students, 10x developers, and busy creators."
            />
            <FeatureCard 
              stepNumber="04 — Get output"
              title="Get bullet points and key takeaways"
              description="Read action points. Structured, bite-sized notes you can act on—complete with key takeaways."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-lg text-gray-600 mb-16">Three simple steps and you're done.</p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              stepNumber={1}
              title="Paste the YouTube video link"
              description="Copy and paste any YouTube URL into the input field."
            />
            <StepCard 
              stepNumber={2}
              title="Select your summary length"
              description="Choose between short, medium, or detailed summaries."
            />
            <StepCard 
              stepNumber={3}
              title="Get your summary instantly"
              description="Receive a comprehensive AI-generated summary in seconds."
            />
          </div>
        </div>
      </section>

      {/* Numbers that speak */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">Numbers that speak</h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            Trusted users and real-time statistics
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">50K</div>
                <div className="text-gray-600 font-medium">Videos summarized</div>
                <div className="text-sm text-gray-500">In the last month alone.</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">10K</div>
                <div className="text-gray-600 font-medium">Active users</div>
                <div className="text-sm text-gray-500">Students and pros saving time daily.</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">200K</div>
                <div className="text-gray-600 font-medium">Hours saved</div>
                <div className="text-sm text-gray-500">By not watching full videos.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What users say */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">What users say</h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            Real feedback from our growing community
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Saves me hours. I can now skim any lecture and stay on top without watching every video."
              author="@Student"
            />
            <TestimonialCard 
              quote="Perfect for research. I drop YouTube links from conferences and get the key talking points."
              author="@Developer"
            />
            <TestimonialCard 
              quote="Simple and fast. I don't need to worry if the video is worth my time—it just shows me everything."
              author="@Creator"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start summarizing videos today
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Drop any link. Choose your length. Get instant notes. No signup required for your first try.
          </p>
          <div className="flex justify-center gap-4">
            <Link href={session ? "/summarize" : "/auth/signup"} className="px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100">
              Get started
            </Link>
            <Link href="/summarize" className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
              Try it now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
