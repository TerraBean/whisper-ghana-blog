// app/components/PostCard.tsx
import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Post } from '@/types';

interface PostCardProps extends Post {
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  category,
  categoryName,
  minutes_to_read,
  created_at,
  published_at,
  className = '',
}) => {
  const dateToShow = published_at || created_at;
  const formattedDate = format(parseISO(dateToShow), 'MMM d, yyyy', { locale: enUS });
  const dateLabel = published_at ? 'Published' : 'Created';
  
  // Use categoryName if available, otherwise use category, fall back to 'Uncategorized'
  const displayCategory = categoryName || category || 'Uncategorized';

  // Generate a random gradient for the card header (purely decorative)
  const gradients = [
    'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500',
    'from-pink-400 to-rose-500',
    'from-amber-400 to-orange-500',
    'from-indigo-400 to-blue-500',
  ];
  
  // Use the post ID to consistently select the same gradient for the same post
  const gradientIndex = id.charCodeAt(0) % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div className={`flex flex-col rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden ${className}`}>
      {/* Decorative header with gradient */}
      <div className={`h-3 w-full bg-gradient-to-r ${gradient}`}></div>
      
      <div className="flex-1 p-6">
        <Link href={`/blog/${id}`} className="block no-underline hover:no-underline group">
          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              {displayCategory}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h2>
          
          {/* Description */}
          {description && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
        </Link>
        
        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {formattedDate}
          </div>
          <div className="flex items-center">
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {minutes_to_read ?? 'N/A'} min read
          </div>
        </div>
      </div>
      
      <div className="group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 transition-colors"></div>
    </div>
  );
};

export default PostCard;