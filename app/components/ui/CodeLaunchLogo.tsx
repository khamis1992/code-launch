import { memo } from 'react';

interface CodeLaunchLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export const CodeLaunchLogo = memo(({ size = 'md', variant = 'full', className = '' }: CodeLaunchLogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (variant === 'icon') {
    return (
      <div
        className={`${iconSizes[size]} ${className} rounded-lg flex items-center justify-center font-bold text-white relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #98FF98 0%, #1E3A8A 100%)',
          boxShadow: '0 4px 12px rgba(152, 255, 152, 0.3)',
        }}
      >
        <span className="text-lg font-black">CL</span>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(245, 245, 220, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <span
        className={`${sizeClasses[size]} ${className} font-bold bg-gradient-to-r from-[#98FF98] to-[#1E3A8A] bg-clip-text text-transparent`}
      >
        CodeLaunch
      </span>
    );
  }

  return (
    <div className={`flex items-center space-x-3 rtl:space-x-reverse ${className}`}>
      {/* الأيقونة */}
      <div
        className={`${iconSizes[size]} rounded-lg flex items-center justify-center font-bold text-white relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #98FF98 0%, #1E3A8A 100%)',
          boxShadow: '0 4px 12px rgba(152, 255, 152, 0.3)',
        }}
      >
        <span className="text-lg font-black">CL</span>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(245, 245, 220, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* النص */}
      <div className="flex flex-col">
        <span
          className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-[#98FF98] to-[#1E3A8A] bg-clip-text text-transparent`}
        >
          CodeLaunch
        </span>
        {size === 'lg' || size === 'xl' ? (
          <span
            className="text-xs font-medium opacity-80"
            style={{ color: 'var(--codelaunch-elements-textSecondary)' }}
          >
            منصة التطوير الذكية
          </span>
        ) : null}
      </div>
    </div>
  );
});
