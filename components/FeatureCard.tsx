import Link from 'next/link';
import Image from 'next/image';

interface FeatureCardProps {
  stepNumber: string;
  title: string;
  description: string;
  imageSrc?: string;
}

export default function FeatureCard({ stepNumber, title, description, imageSrc }: FeatureCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-8">
      <div className="mb-4">
        <span className="text-sm font-semibold text-gray-500">{stepNumber}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      <div className="flex gap-4 mb-6">
        <Link href="/summarize" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800">
          Try it
        </Link>
        <Link href="/summarize" className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">
          About →
        </Link>
      </div>
      <div className="rounded-lg h-48 flex items-center justify-center relative">
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={title} 
            fill
            className="object-contain p-4"
          />
        ) : (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
    </div>
  );
}
