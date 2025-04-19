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
  categoryName,
  minutes_to_read,
  created_at,
  published_at,
  className = '',
}) => {
  const dateToShow = published_at || created_at;
  const formattedDate = format(parseISO(dateToShow), 'MMM d, yyyy', { locale: enUS });
  const dateLabel = published_at ? 'Published' : 'Created';

  return (
    <div className={`card border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800 ${className}`}>
      <Link href={`/blog/${id}`} className="block no-underline hover:no-underline group">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h2>
        {description && <p className="text-gray-800 dark:text-gray-200 mb-4 line-clamp-2">{description}</p>}
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
            {categoryName || 'Uncategorized'}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {minutes_to_read ?? 'N/A'} min read
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {dateLabel}: {formattedDate}
        </div>
      </Link>
    </div>
  );
};

export default PostCard;