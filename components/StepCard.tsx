import Image from 'next/image';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  imageSrc?: string;
}

export default function StepCard({ stepNumber, title, description, imageSrc }: StepCardProps) {
  return (
    <div>
      <div className="mb-6">
        <span className="text-sm font-semibold text-gray-500">Step {stepNumber}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {description}
      </p>
      <div className="bg-gray-50 rounded-lg h-48 flex items-center justify-center p-6 relative">
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
