import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "YouTube Summarizer - AI Video Notes & Summary Generator | Free",
    template: "%s | YouTube Summarizer"
  },
  description: "Free AI-powered YouTube summarizer. Generate instant notes, summaries, and key takeaways from any YouTube video in seconds. Save time with smart video summarization.",
  keywords: [
    "youtube summarizer",
    "youtube summary generator",
    "video notes",
    "ai video summarizer",
    "youtube transcript summary",
    "video to text summary",
    "youtube notes maker",
    "free youtube summarizer",
    "ai notes generator",
    "video summarization tool",
    "youtube key points extractor",
    "automatic video summary",
    "youtube study notes",
    "video content summary",
    "youtube bullet points"
  ],
  authors: [{ name: "snivio" }],
  creator: "snivio",
  publisher: "snivio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snivio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://snivio.com',
    title: 'YouTube Summarizer - AI Video Notes & Summary Generator',
    description: 'Free AI-powered YouTube summarizer. Generate instant notes, summaries, and key takeaways from any YouTube video in seconds.',
    siteName: 'YouTube Summarizer by snivio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YouTube Summarizer - AI Video Notes Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Summarizer - AI Video Notes & Summary Generator',
    description: 'Free AI-powered YouTube summarizer. Generate instant notes and summaries from any video in seconds.',
    images: ['/og-image.png'],
    creator: '@snivio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'YouTube Summarizer',
              applicationCategory: 'EducationalApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Free AI-powered YouTube summarizer that generates instant notes, summaries, and key takeaways from any YouTube video.',
              operatingSystem: 'Any',
              url: 'https://snivio.com',
              creator: {
                '@type': 'Organization',
                name: 'snivio',
              },
              featureList: [
                'Instant YouTube video summarization',
                'AI-powered note generation',
                'Key points extraction',
                'Multiple summary lengths',
                'Bullet point format',
                'Action items extraction',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
