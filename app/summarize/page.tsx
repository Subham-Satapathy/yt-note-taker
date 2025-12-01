'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import LoadingModal from '@/components/LoadingModal';
import SummaryResult from '@/components/SummaryResult';

interface SummaryResult {
  title: string | null;
  summary: string;
  bulletPoints: string[];
  actionItems?: string[];
}

export default function SummarizePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [wordCount, setWordCount] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showBullets, setShowBullets] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const includeNotes = true;

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setShowSummary(false);
    setShowBullets(false);
    setShowActions(false);

    if (!session) {
      setError('Please sign in to use this service');
      router.push('/auth/signin');
      return;
    }

    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYoutubeUrl(youtubeUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Extract video ID and show modal
    const extractedId = extractVideoId(youtubeUrl);
    if (extractedId) {
      setVideoId(extractedId);
    }

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl,
          wordCount,
          includeNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        clearInterval(progressInterval);
        if (response.status === 401) {
          setError('Please sign in to continue');
          router.push('/auth/signin');
          return;
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(data.error || 'Failed to generate notes');
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      // Wait a moment to show 100% before closing modal
      setTimeout(() => {
        setResult(data);
        setVideoId(null); // Close modal
        setTimeout(() => {
          setShowSummary(true);
          setShowBullets(true);
          setShowActions(true);
        }, 300);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setVideoId(null); // Close modal on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Loading Modal with YouTube Thumbnail */}
      {videoId && isLoading && (
        <LoadingModal 
          videoId={videoId} 
          progress={progress}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Summarize YouTube Videos</h1>
          <p className="text-lg text-gray-600">Paste any YouTube URL and get instant AI-powered summaries</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Summary Length
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 50, label: 'Short' },
                  { value: 150, label: 'Brief' },
                  { value: 300, label: 'Medium' },
                  { value: 500, label: 'Long' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setWordCount(option.value)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition ${
                      wordCount === option.value
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={isLoading}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Notes...
                </span>
              ) : (
                'Generate Notes'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <SummaryResult 
            title={result.title}
            summary={result.summary}
            bulletPoints={result.bulletPoints}
            actionItems={result.actionItems}
            wordCount={wordCount}
            showSummary={showSummary}
            showBullets={showBullets}
            showActions={showActions}
          />
        )}
      </div>
    </main>
  );
}
