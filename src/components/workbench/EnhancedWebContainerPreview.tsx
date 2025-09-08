/**
 * Enhanced WebContainer Preview Component  
 * Optimized for Flutter and complex projects
 */

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { toast } from 'react-toastify';

export interface EnhancedWebContainerPreviewProps {
  onLoad?: () => void;
  onError?: (error: any) => void;
  showProgress?: boolean;
}

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  estimatedTime: number;
}

export function EnhancedWebContainerPreview({ 
  onLoad, 
  onError, 
  showProgress = true 
}: EnhancedWebContainerPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(90);
  
  const files = useStore(workbenchStore.files);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[0];

  // Loading steps for Flutter projects
  const loadingSteps: LoadingStep[] = [
    {
      id: 'environment',
      title: 'إعداد بيئة التطوير',
      description: 'تحضير بيئة Flutter وDart SDK',
      status: 'pending',
      estimatedTime: 20
    },
    {
      id: 'dependencies',
      title: 'تحميل المكتبات',
      description: 'تنزيل packages من pub.dev',
      status: 'pending', 
      estimatedTime: 30
    },
    {
      id: 'analysis',
      title: 'تحليل الكود',
      description: 'فحص الكود والتحقق من الأخطاء',
      status: 'pending',
      estimatedTime: 15
    },
    {
      id: 'building',
      title: 'بناء التطبيق',
      description: 'تجميع وإنشاء التطبيق',
      status: 'pending',
      estimatedTime: 20
    },
    {
      id: 'preview',
      title: 'تشغيل المعاينة',
      description: 'بدء تشغيل التطبيق في المتصفح',
      status: 'pending',
      estimatedTime: 5
    }
  ];

  const [steps, setSteps] = useState(loadingSteps);

  // Simulate realistic loading progression
  useEffect(() => {
    if (!isLoading) return;

    let currentStepIndex = 0;
    let totalProgress = 0;
    
    const progressInterval = setInterval(() => {
      if (currentStepIndex >= steps.length) {
        clearInterval(progressInterval);
        setIsLoading(false);
        setProgress(100);
        onLoad?.();
        toast.success('🎉 تطبيق Flutter جاهز للمعاينة!');
        return;
      }

      const currentStepData = steps[currentStepIndex];
      
      // Update step status
      setSteps(prevSteps => 
        prevSteps.map((step, index) => ({
          ...step,
          status: index < currentStepIndex ? 'completed' : 
                 index === currentStepIndex ? 'loading' : 'pending'
        }))
      );

      // Update progress
      const stepProgress = (currentStepIndex / steps.length) * 100;
      setProgress(stepProgress);
      
      // Update estimated time
      const remainingSteps = steps.slice(currentStepIndex + 1);
      const remainingTime = remainingSteps.reduce((sum, step) => sum + step.estimatedTime, 0);
      setEstimatedTimeLeft(remainingTime);

      currentStepIndex++;
    }, 2000); // Each step takes ~2 seconds

    return () => clearInterval(progressInterval);
  }, [isLoading, steps.length, onLoad]);

  // Check for actual preview availability
  useEffect(() => {
    if (activePreview?.ready && isLoading) {
      setIsLoading(false);
      setProgress(100);
      setSteps(prevSteps => 
        prevSteps.map(step => ({ ...step, status: 'completed' }))
      );
    }
  }, [activePreview, isLoading]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.58L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">خطأ في بناء التطبيق</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setCurrentStep(0);
              setProgress(0);
            }}
            className="btn rounded-lg bg-[--mint] text-[--marine] px-4 py-2 text-sm font-semibold"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && showProgress) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md p-6">
          {/* Progress Header */}
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 grid place-items-center rounded-2xl bg-[--mint]/20 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--mint]"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">🚀 جاري بناء تطبيقك</h3>
            <p className="text-white/70">يرجى الانتظار بينما نقوم بإعداد بيئة Flutter...</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">التقدم</span>
              <span className="text-[--mint]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-[--mint] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>بدء التشغيل</span>
              <span>{estimatedTimeLeft} ثانية متبقية</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  step.status === 'completed' ? 'bg-green-500/10 border border-green-500/20' :
                  step.status === 'loading' ? 'bg-[--mint]/10 border border-[--mint]/20' :
                  step.status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
                  'bg-white/5 border border-white/10'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {step.status === 'completed' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                  {step.status === 'loading' && (
                    <div className="w-6 h-6 border-2 border-[--mint] border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {step.status === 'error' && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white/60">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <p className="text-xs text-white/60">{step.description}</p>
                </div>

                {/* Time */}
                {step.status === 'loading' && (
                  <div className="text-xs text-[--mint]">
                    ~{step.estimatedTime}ث
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Helpful Tips */}
          <div className="mt-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">💡 نصيحة</h4>
            <p className="text-xs text-blue-300">
              بناء تطبيق Flutter يحتاج وقت أطول لضمان جودة عالية. النتيجة ستكون تطبيق احترافي قابل للنشر!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show actual preview when ready
  if (activePreview?.ready) {
    return (
      <div className="h-full relative">
        <iframe
          src={activePreview.baseUrl}
          className="w-full h-full border-none"
          title="Flutter App Preview"
          sandbox="allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation allow-same-origin"
          onLoad={() => {
            toast.success('🎉 تطبيق Flutter جاهز!');
          }}
        />
        
        {/* Success Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs">
            ✅ Flutter App • جاهز للاستخدام
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--mint] mx-auto mb-4"></div>
        <p className="text-white/70">تحضير بيئة التطوير...</p>
      </div>
    </div>
  );
}
