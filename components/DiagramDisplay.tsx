'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface DiagramDisplayProps {
  mermaidCode: string;
}

export default function DiagramDisplay({ mermaidCode }: DiagramDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    });
  }, []);

  useEffect(() => {
    if (mermaidCode && containerRef.current) {
      renderDiagram();
    }
  }, [mermaidCode]);

  const renderDiagram = async () => {
    if (!containerRef.current || !mermaidCode) return;

    try {
      containerRef.current.innerHTML = '';
      containerRef.current.removeAttribute('data-processed');
      
      const { svg } = await mermaid.render('diagram-svg-' + Date.now(), mermaidCode);
      containerRef.current.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid render error:', err);
      containerRef.current.innerHTML = '<p class="text-red-600 text-sm">Failed to render diagram</p>';
    }
  };

  const downloadDiagram = () => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagram-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(mermaidCode);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Visual Diagram
        </h2>
        <div className="flex gap-2">
          <button
            onClick={copyCode}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            title="Copy diagram code"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={downloadDiagram}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            title="Download diagram"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200 overflow-x-auto">
        <div ref={containerRef} className="flex justify-center items-center min-h-[200px]" />
      </div>
    </div>
  );
}
