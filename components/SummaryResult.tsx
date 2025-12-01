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
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {title && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight flex-1">
              {title}
            </h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className={`transition-all duration-500 lg:sticky lg:top-6 lg:self-start ${
          showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
            <div className="bg-gray-900 px-5 md:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">Summary</h3>
              </div>
              <span className="text-xs font-semibold bg-white text-gray-900 px-3 py-1.5 rounded-lg">
                {wordCount} words
              </span>
            </div>
            <div className="p-5 md:p-6">
              {showSummary ? (
                <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-4">
                  {summary.split(/\n\n+/).filter(p => p.trim()).map((paragraph, index) => (
                    <p key={index} className="text-gray-700">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading summary...</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {bulletPoints && bulletPoints.length > 0 && (
            <div className={`transition-all duration-500 ${
              showBullets ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-900 px-5 md:px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Key Notes</h3>
                </div>
                <div className="p-5 md:p-6 space-y-4">
                  {bulletPoints.map((point, index) => (
                    <div
                      key={index}
                      className={`flex items-start transition-all duration-500 ${
                        showBullets ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-semibold mr-3 md:mr-4 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm md:text-base text-gray-700 leading-relaxed pt-0.5">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {actionItems && actionItems.length > 0 && (
            <div className={`transition-all duration-500 ${
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-900 px-5 md:px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Action Items & Questions</h3>
                </div>
                <div className="p-5 md:p-6 space-y-4">
                  {actionItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start transition-all duration-500 ${
                        showActions ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 bg-gray-900 text-white rounded flex items-center justify-center mr-3 md:mr-4 mt-0.5">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-gray-700 leading-relaxed pt-0.5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
