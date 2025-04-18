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
    <div className={`border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link href={`/blog/${id}`} className="block no-underline">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        {description && <p className="text-gray-700 mb-3">{description}</p>}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Category: {categoryName || 'Uncategorized'}</span>
          <span className="text-sm text-gray-500">{minutes_to_read ?? 'N/A'} min read</span>
        </div>
        <p className="text-sm text-gray-500">
          {dateLabel}: {formattedDate}
        </p>
      </Link>
    </div>
  );
};

export default PostCard;