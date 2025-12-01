import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Dark */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white mb-6">Snivv</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Transform any YouTube video into instant summaries and actionable notes. Save hours and never miss key insights again.
          </p>
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
