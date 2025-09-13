import React from 'react';

interface UserFriendlyPreviewProps {
  className?: string;
}

/**
 * UserFriendlyPreview - A placeholder component for user-friendly preview mode
 * TODO: Implement proper user-friendly preview functionality
 */
export const UserFriendlyPreview: React.FC<UserFriendlyPreviewProps> = ({ 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center h-full bg-gray-100 rounded-lg ${className}`}>
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          User-Friendly Preview
        </h3>
        <p className="text-gray-500 text-sm max-w-xs">
          This preview mode is designed to provide a more user-friendly interface. 
          Implementation coming soon.
        </p>
      </div>
    </div>
  );
};

export default UserFriendlyPreview;