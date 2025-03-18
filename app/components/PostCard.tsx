// app/components/PostCard.tsx
import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { PostCardProps } from '@/app/types';

interface PostCardComponentProps extends PostCardProps {
  className?: string;
}

const PostCard: React.FC<PostCardComponentProps> = ({
  id,
  title,
  description,
  category,
  minutesToRead,
  createdAt,
  published_at,
  tags,
  className = '',
}) => {
  const dateToShow = published_at || createdAt;
  const formattedDate = format(parseISO(dateToShow), 'MMM d, yyyy', { locale: enUS });
  const dateLabel = published_at ? 'Published' : 'Created';

  return (
    <div className={`border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link href={`/blog/${id}`} className="block no-underline">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-700 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags?.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Category: {category || 'Uncategorized'}</span>
          <span className="text-sm text-gray-500">{minutesToRead ?? 'N/A'} min read</span>
        </div>
        <p className="text-sm text-gray-500">
          {dateLabel}: {formattedDate}
        </p>
      </Link>
    </div>
  );
};

export default PostCard;