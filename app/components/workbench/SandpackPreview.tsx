/**
 * Enhanced Sandpack Preview Component
 * Fast preview for simple web projects
 */

// Dynamic import to avoid build errors
// import { Sandpack } from '@codesandbox/sandpack-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export interface SandpackPreviewProps {
  files: Record<string, string>;
  template?: 'vanilla' | 'react' | 'vue' | 'angular';
  theme?: 'dark' | 'light';
  onError?: (error: any) => void;
  onLoad?: () => void;
}

export function SandpackPreview({ 
  files, 
  template = 'vanilla', 
  theme = 'dark',
  onError,
  onLoad 
}: SandpackPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert files to Sandpack format
  const sandpackFiles = {
    ...files,
    // Ensure index.html exists for vanilla projects
    ...(template === 'vanilla' && !files['/index.html'] && {
      '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeLaunch Preview</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div id="app">
    <h1>🚀 CodeLaunch Preview</h1>
    <p>Your app is loading...</p>
  </div>
  <script src="/script.js"></script>
</body>
</html>`
    })
  };

  // Handle loading states
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoad?.();
      toast.success('معاينة فورية جاهزة!');
    }, 2000);

    return () => clearTimeout(timer);
  }, [files, onLoad]);

  const handleError = (error: any) => {
    console.error('Sandpack error:', error);
    setError(error.message || 'خطأ في المعاينة');
    onError?.(error);
    toast.error('خطأ في المعاينة الفورية');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.58L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            خطأ في المعاينة
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
            className="btn rounded-lg bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--mint] mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">⚡ تحميل المعاينة الفورية...</p>
          </div>
        </div>
      )}
      
      <div className="h-full">
        {/* Sandpack Placeholder - Will be implemented when package is properly installed */}
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
          <div className="text-center p-8">
            <div className="mx-auto h-16 w-16 grid place-items-center rounded-2xl bg-blue-500/20 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                <path d="M12 2l3.09 6.26L22 9l-5.91 5.82L17.91 22 12 18.27 6.09 22l1.82-7.18L2 9l6.91-.74L12 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">⚡ معاينة فورية</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              مثالي للمشاريع البسيطة - معاينة خلال ثوانٍ
            </p>
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>HTML/CSS/JavaScript</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>React & Vue.js</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>تحديث فوري</span>
              </div>
            </div>
            
            {/* Show files being previewed */}
            {Object.keys(sandpackFiles).length > 0 && (
              <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">الملفات:</div>
                <div className="space-y-1">
                  {Object.keys(sandpackFiles).slice(0, 3).map(file => (
                    <div key={file} className="text-xs text-gray-500 dark:text-gray-400">
                      📄 {file}
                    </div>
                  ))}
                  {Object.keys(sandpackFiles).length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{Object.keys(sandpackFiles).length - 3} ملف آخر
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 rounded-lg p-2">
          <button className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
            💻 Desktop
          </button>
          <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded">
            📱 Mobile
          </button>
        </div>
      </div>

      {/* Performance Info */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs">
          ⚡ معاينة فورية • أقل من 5 ثوانٍ
        </div>
      </div>
    </div>
  );
}
