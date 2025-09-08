/**
 * Hybrid Preview System
 * Automatically chooses between Sandpack and WebContainer
 */

import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { PreviewEngineSelector, type ProjectAnalysis, type EngineRecommendation } from '~/lib/services/previewEngineSelector';
import { SandpackPreview } from './SandpackPreview';
import { EnhancedWebContainerPreview } from './EnhancedWebContainerPreview';
import { toast } from 'react-toastify';

export interface HybridPreviewProps {
  initialPrompt?: string;
  onEngineChange?: (engine: 'sandpack' | 'webcontainer') => void;
}

export function HybridPreview({ initialPrompt = '', onEngineChange }: HybridPreviewProps) {
  const [selectedEngine, setSelectedEngine] = useState<'sandpack' | 'webcontainer'>('webcontainer');
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [recommendation, setRecommendation] = useState<EngineRecommendation | null>(null);
  const [showEngineInfo, setShowEngineInfo] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const files = useStore(workbenchStore.files);
  const hasFiles = Object.keys(files).length > 0;

  // Analyze project and select engine
  useEffect(() => {
    if (hasFiles || initialPrompt) {
      const projectAnalysis = PreviewEngineSelector.analyzeProject(initialPrompt, files);
      const engineRecommendation = PreviewEngineSelector.selectEngine(projectAnalysis);
      
      setAnalysis(projectAnalysis);
      setRecommendation(engineRecommendation);
      
      // Auto-select engine if not manually overridden
      if (!manualOverride) {
        setSelectedEngine(engineRecommendation.engine);
        onEngineChange?.(engineRecommendation.engine);
        
        // Show notification about engine choice
        if (engineRecommendation.confidence > 0.8) {
          const engineName = engineRecommendation.engine === 'sandpack' ? 'المعاينة الفورية' : 'بيئة Flutter الكاملة';
          toast.info(`تم اختيار ${engineName} تلقائياً لأفضل أداء`);
        }
      }
    }
  }, [files, initialPrompt, manualOverride, onEngineChange]);

  // Convert files to Sandpack format
  const sandpackFiles = Object.entries(files).reduce((acc, [filePath, file]) => {
    if (file?.type === 'file' && typeof file.content === 'string') {
      acc[filePath.startsWith('/') ? filePath : `/${filePath}`] = file.content;
    }
    return acc;
  }, {} as Record<string, string>);

  // Detect template type for Sandpack
  const detectSandpackTemplate = (): 'vanilla' | 'react' | 'vue' => {
    if (Object.keys(sandpackFiles).some(file => file.includes('package.json'))) {
      const packageJson = sandpackFiles['/package.json'] || sandpackFiles['package.json'];
      if (packageJson?.includes('react')) return 'react';
      if (packageJson?.includes('vue')) return 'vue';
    }
    return 'vanilla';
  };

  if (!hasFiles && !initialPrompt) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl font-extrabold" 
               style={{ background: 'var(--sand)', color: 'var(--marine)' }}>
            CL
          </div>
          <p className="mt-4 text-white/60">المعاينة ستظهر هنا</p>
          <p className="mt-2 text-xs text-white/40">ابدأ في إنشاء تطبيقك لرؤية المعاينة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Engine Selector & Info */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        {/* Engine Toggle */}
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => {
              setSelectedEngine('sandpack');
              setManualOverride(true);
              onEngineChange?.('sandpack');
              toast.info('تم التبديل للمعاينة الفورية');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              selectedEngine === 'sandpack'
                ? 'bg-[--mint] text-[--marine]'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            ⚡ فوري
          </button>
          <button
            onClick={() => {
              setSelectedEngine('webcontainer');
              setManualOverride(true);
              onEngineChange?.('webcontainer');
              toast.info('تم التبديل لبيئة Flutter الكاملة');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              selectedEngine === 'webcontainer'
                ? 'bg-[--mint] text-[--marine]'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🚀 كامل
          </button>
        </div>

        {/* Engine Info */}
        <button
          onClick={() => setShowEngineInfo(!showEngineInfo)}
          className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white/70 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </button>
      </div>

      {/* Engine Information Panel */}
      {showEngineInfo && recommendation && (
        <div className="absolute top-16 left-4 right-4 z-30 bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-semibold text-white">معلومات المحرك</h4>
            <button
              onClick={() => setShowEngineInfo(false)}
              className="text-white/60 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">المحرك المختار:</span>
              <span className="text-[--mint]">
                {selectedEngine === 'sandpack' ? 'Sandpack (فوري)' : 'WebContainer (كامل)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">نوع المشروع:</span>
              <span className="text-white">{analysis?.framework || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">التعقيد:</span>
              <span className="text-white">{analysis?.complexity || 'متوسط'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">الوقت المتوقع:</span>
              <span className="text-white">{recommendation.estimatedLoadTime} ثانية</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-white/60">{recommendation.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Content */}
      <div className="h-full">
        {selectedEngine === 'sandpack' ? (
          <SandpackPreview
            files={sandpackFiles}
            template={detectSandpackTemplate()}
            theme="dark"
            onLoad={() => toast.success('⚡ معاينة فورية جاهزة!')}
            onError={(error) => {
              toast.error('خطأ في المعاينة الفورية');
              console.error('Sandpack error:', error);
              // Fallback to WebContainer on Sandpack error
              setSelectedEngine('webcontainer');
            }}
          />
        ) : (
          <EnhancedWebContainerPreview
            showProgress={true}
            onLoad={() => toast.success('🚀 بيئة Flutter جاهزة!')}
            onError={(error) => {
              toast.error('خطأ في بيئة Flutter');
              console.error('WebContainer error:', error);
            }}
          />
        )}
      </div>
    </div>
  );
}
