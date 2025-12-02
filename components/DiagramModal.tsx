'use client';

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface DiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  bulletPoints: string[];
  actionItems?: string[];
}

export default function DiagramModal({
  isOpen,
  onClose,
  summary,
  bulletPoints,
  actionItems,
}: DiagramModalProps) {
  const [diagramType, setDiagramType] = useState<'flowchart' | 'mindmap'>('flowchart');
  const [loading, setLoading] = useState(false);
  const [mermaidCode, setMermaidCode] = useState('');
  const [error, setError] = useState('');
  const [diagramRendered, setDiagramRendered] = useState(false);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    });
  }, []);

  useEffect(() => {
    if (mermaidCode && !loading) {
      renderDiagram();
    }
  }, [mermaidCode]);

  const generateDiagram = async () => {
    setLoading(true);
    setError('');
    setDiagramRendered(false);
    setMermaidCode('');

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary,
          bulletPoints,
          actionItems,
          diagramType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diagram');
      }

      const data = await response.json();
      setMermaidCode(data.mermaidCode);
    } catch (err: any) {
      console.error('Diagram generation error:', err);
      setError(err.message || 'Failed to generate diagram');
    } finally {
      setLoading(false);
    }
  };

  const renderDiagram = async () => {
    const diagramContainer = document.getElementById('mermaid-diagram');
    if (!diagramContainer || !mermaidCode) return;

    try {
      diagramContainer.innerHTML = '';
      diagramContainer.removeAttribute('data-processed');
      
      const { svg } = await mermaid.render('diagram-svg', mermaidCode);
      diagramContainer.innerHTML = svg;
      setDiagramRendered(true);
    } catch (err: any) {
      console.error('Mermaid render error:', err);
      setError('Failed to render diagram. The generated code may be invalid.');
    }
  };

  const downloadDiagram = () => {
    const svg = document.querySelector('#mermaid-diagram svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${diagramType}-${Date.now()}.svg`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const copyMermaidCode = () => {
    navigator.clipboard.writeText(mermaidCode);
    alert('Mermaid code copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Generate Diagram</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Diagram Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Diagram Type:
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setDiagramType('flowchart')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  diagramType === 'flowchart'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">Flowchart</span>
                </div>
                <p className="text-xs mt-1 opacity-80">Process & workflow diagram</p>
              </button>
              <button
                onClick={() => setDiagramType('mindmap')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  diagramType === 'mindmap'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span className="font-medium">Mind Map</span>
                </div>
                <p className="text-xs mt-1 opacity-80">Concept & relationship map</p>
              </button>
            </div>
          </div>

          {/* Generate Button */}
          {!mermaidCode && (
            <button
              onClick={generateDiagram}
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating {diagramType}...
                </span>
              ) : (
                `Generate ${diagramType === 'flowchart' ? 'Flowchart' : 'Mind Map'}`
              )}
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Diagram Display */}
          {mermaidCode && (
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={generateDiagram}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Regenerate
                </button>
                {diagramRendered && (
                  <>
                    <button
                      onClick={downloadDiagram}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Download SVG
                    </button>
                    <button
                      onClick={copyMermaidCode}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Copy Code
                    </button>
                  </>
                )}
              </div>

              {/* Diagram Container */}
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-white overflow-auto">
                <div id="mermaid-diagram" className="flex justify-center items-center min-h-[300px]">
                  {loading && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rendering diagram...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
