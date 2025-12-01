interface LoadingModalProps {
  videoId: string;
  progress: number;
  onClose?: () => void;
}

export default function LoadingModal({ videoId, progress, onClose }: LoadingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full mx-4">
        {/* YouTube Thumbnail */}
        <div className="relative aspect-video">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-contain bg-black"
            onError={(e) => {
              // Fallback to default quality thumbnail
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Progress Section */}
        <div className="p-8 text-center">
          {/* Circular Progress */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-24 h-24 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className="text-gray-900 transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{progress}%</span>
            </div>
          </div>

          {/* Loading text */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Generating Summary
          </h3>
          <p className="text-gray-600">
            Analyzing video content and creating your notes...
          </p>

          {/* Loading dots animation */}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
