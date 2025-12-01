import TypewriterText from './TypewriterText';

interface SummaryResultProps {
  title: string | null;
  summary: string;
  bulletPoints: string[];
  actionItems?: string[];
  wordCount: number;
  showSummary: boolean;
  showBullets: boolean;
  showActions: boolean;
}

export default function SummaryResult({
  title,
  summary,
  bulletPoints,
  actionItems,
  wordCount,
  showSummary,
  showBullets,
  showActions,
}: SummaryResultProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {title && (
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`transition-all duration-500 lg:sticky lg:top-6 lg:self-start ${
          showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Summary</h3>
            </div>
            <span className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-full">
              {wordCount} words
            </span>
          </div>
          <div className="border-l-4 border-blue-600 pl-6">
            {showSummary ? (
              <TypewriterText
                text={summary}
                speed={20}
                className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap"
              />
            ) : (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading summary...</div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {bulletPoints && bulletPoints.length > 0 && (
            <div className={`transition-all duration-500 ${
              showBullets ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Key Notes</h3>
              </div>
              <div className="space-y-3">
                {bulletPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`flex items-start transition-all duration-500 ${
                      showBullets ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-base text-gray-900 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {actionItems && actionItems.length > 0 && (
            <div className={`transition-all duration-500 ${
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Action Items & Questions</h3>
              </div>
              <div className="space-y-3">
                {actionItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start transition-all duration-500 ${
                      showActions ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-base text-gray-900 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
