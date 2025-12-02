'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import StepCard from '@/components/StepCard';
import TestimonialCard from '@/components/TestimonialCard';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Choose Our YouTube Summarizer?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Transform any YouTube video into concise, actionable notes with AI-powered summarization</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <FeatureCard 
              stepNumber="01 — Paste link"
              title="Drop your YouTube link and let it work"
              description="Just paste your link. Our YouTube link parser grabs the video. That's all you need to start."
              imageSrc="/undraw_share-link_y9oh.svg"
            />
            <FeatureCard 
              stepNumber="02 — Fast output"
              title="Choose how much detail you need"
              description="Select from 50, 150, or 300 words. Get exactly the depth you want—no more or less."
              imageSrc="/undraw_add-information_06qr.svg"
            />
            <FeatureCard 
              stepNumber="03 — Get output"
              title="Receive your summary in seconds"
              description="Instant, AI-based summaries. Designed for students, 10x developers, and busy creators."
              imageSrc="/undraw_personal-file_81l0.svg"
            />
            <FeatureCard 
              stepNumber="04 — Get output"
              title="Get bullet points and key takeaways"
              description="Read action points. Structured, bite-sized notes you can act on—complete with key takeaways."
              imageSrc="/undraw_pin-to-board_eoie.svg"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">How it works</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-12 sm:mb-16">Three simple steps and you're done.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <StepCard 
              stepNumber={1}
              title="Paste the YouTube video link"
              description="Copy and paste any YouTube URL into the input field."
              imageSrc="/undraw_share-link_y9oh.svg"
            />
            <StepCard 
              stepNumber={2}
              title="Select your summary length"
              description="Choose between short, medium, or detailed summaries."
              imageSrc="/undraw_select-option_a16s.svg"
            />
            <StepCard 
              stepNumber={3}
              title="Get your summary instantly"
              description="Receive a comprehensive AI-generated summary in seconds."
              imageSrc="/undraw_speed-test_wdyh.svg"
            />
          </div>
        </div>
      </section>

      {/* Numbers that speak */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-3 sm:mb-4">Numbers that speak</h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 sm:mb-16">
            Trusted users and real-time statistics
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="rounded-lg flex items-center justify-center relative h-64 sm:h-80 lg:h-96 order-2 lg:order-1">
              <Image 
                src="/undraw_playlist_lwhi.svg" 
                alt="Numbers that speak" 
                fill
                className="object-contain"
              />
            </div>
            
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">50K</div>
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-3 sm:mb-4">What users say</h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-12 sm:mb-16">
            Real feedback from our growing community
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">Ready to get started?</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Drop any link. Choose your length. Get instant notes. No signup required for your first try.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link href={session ? "/summarize" : "/auth/signup"} className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Get started
            </Link>
            <Link href="/summarize" className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors">
              Try it now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
