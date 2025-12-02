'use client';

import { useState } from 'react';
import DiagramDisplay from './DiagramDisplay';

interface SummaryResultProps {
  title: string | null;
  summary: string;
  bulletPoints: string[];
  actionItems?: string[];
  wordCount: number;
  showSummary: boolean;
  showBullets: boolean;
  showActions: boolean;
  mermaidCode?: string;
}

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  bn: 'Bengali',
  ur: 'Urdu',
  tr: 'Turkish',
  vi: 'Vietnamese',
  th: 'Thai',
  nl: 'Dutch',
  pl: 'Polish',
  sv: 'Swedish',
};

export default function SummaryResult({
  title,
  summary,
  bulletPoints,
  actionItems,
  wordCount,
  showSummary,
  showBullets,
  showActions,
  mermaidCode,
}: SummaryResultProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState<string>(summary);
  const [translatedBullets, setTranslatedBullets] = useState<string[]>(bulletPoints);
  const [translatedActions, setTranslatedActions] = useState<string[] | undefined>(actionItems);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleTranslate = async (language: string) => {
    if (language === 'en') {
      setTranslatedSummary(summary);
      setTranslatedBullets(bulletPoints);
      setTranslatedActions(actionItems);
      setSelectedLanguage('en');
      return;
    }

    if (!language || language === selectedLanguage) return;

    setTranslating(true);
    setSelectedLanguage(language);

    try {
      const [summaryResponse, bulletsResponse, actionsResponse] = await Promise.all([
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: summary,
            targetLanguage: language,
            type: 'summary',
          }),
        }),
        fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: bulletPoints,
            targetLanguage: language,
            type: 'bulletPoints',
          }),
        }),
        actionItems && actionItems.length > 0
          ? fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: actionItems,
                targetLanguage: language,
                type: 'actionItems',
              }),
            })
          : Promise.resolve(null),
      ]);

      if (!summaryResponse.ok) throw new Error('Translation failed');

      const summaryData = await summaryResponse.json();
      setTranslatedSummary(summaryData.translatedText);

      if (bulletsResponse.ok) {
        const bulletsData = await bulletsResponse.json();
        setTranslatedBullets(Array.isArray(bulletsData.translatedText) 
          ? bulletsData.translatedText 
          : bulletPoints);
      }

      if (actionsResponse && actionsResponse.ok) {
        const actionsData = await actionsResponse.json();
        setTranslatedActions(Array.isArray(actionsData.translatedText) 
          ? actionsData.translatedText 
          : actionItems);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate. Please try again.');
    } finally {
      setTranslating(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Action Bar with Language Selector and Buttons */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">Translate to:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LANGUAGES).slice(0, 10).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleTranslate(code)}
                  disabled={translating}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedLanguage === code
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {name}
                </button>
              ))}
              <select
                value={selectedLanguage}
                onChange={(e) => handleTranslate(e.target.value)}
                disabled={translating}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border-none outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="">More...</option>
                {Object.entries(LANGUAGES).slice(10).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {translating && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Translating to {LANGUAGES[selectedLanguage as keyof typeof LANGUAGES]}...
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:gap-8">
        {/* Diagram Section - Show before summary if available */}
        {mermaidCode && (
          <div
            className={`transition-all duration-500 transform ${
              showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <DiagramDisplay mermaidCode={mermaidCode} />
          </div>
        )}

        {/* Summary Section */}
        {showSummary && (
          <div
            className={`transition-all duration-500 transform ${
              showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-5 md:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Summary</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-white text-gray-900 px-3 py-1.5 rounded-lg">
                    {wordCount} words
                  </span>
                  <button
                    onClick={() => copyToClipboard(translatedSummary, 'summary')}
                    className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy summary"
                  >
                    {copiedSection === 'summary' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-4">
                {translatedSummary.split(/\n\n+/).filter((p: string) => p.trim()).map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bullet Points Section */}
        {showBullets && bulletPoints && bulletPoints.length > 0 && (
          <div
            className={`transition-all duration-500 transform ${
              showBullets ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-5 md:px-6 py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Key Notes</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(translatedBullets.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n'), 'bullets')}
                  className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copy key points"
                >
                  {copiedSection === 'bullets' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-6 md:p-8">
                <ul className="space-y-4">
                  {translatedBullets.map((point: string, index: number) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 md:gap-4 transition-all duration-300 delay-${index * 50} ${
                        showBullets ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                    >
                      <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-base leading-relaxed flex-1 pt-0.5">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Items Section */}
        {showActions && actionItems && actionItems.length > 0 && (
          <div
            className={`transition-all duration-500 transform ${
              showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-5 md:px-6 py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Action Items & Questions</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(translatedActions?.map((a: string) => `→ ${a}`).join('\n') || '', 'actions')}
                  className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copy action items"
                >
                  {copiedSection === 'actions' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
                <ul className="space-y-3">
                  {translatedActions && translatedActions.map((item: string, index: number) => (
                    <li
                      key={index}
                      className={`flex items-start gap-3 transition-all duration-300 delay-${index * 50} ${
                        showActions ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                    >
                      <span className="flex-shrink-0 text-gray-900 font-bold text-lg mt-0.5">→</span>
                      <span className="text-gray-700 leading-relaxed flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
