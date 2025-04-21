import React from 'react';

type SkeletonProps = {
  type: 'table' | 'list' | 'activity' | 'comments';
};

const LoadingSkeleton: React.FC<SkeletonProps> = ({ type }) => {
  switch (type) {
    case 'table':
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-pulse">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'list':
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-pulse">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'activity':
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-pulse">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/5 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex">
                <div className="mr-3 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="w-full">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
    case 'comments':
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-pulse">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      );
  }
};

export default LoadingSkeleton;