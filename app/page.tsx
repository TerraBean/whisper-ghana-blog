// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getRecentPosts } from '@/utils/api';
import { PostCardProps } from './types'; // Adjust path if needed

// PostCard component (moved to app/components/PostCard.tsx in Step 3, reused here for now)
const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  category,
  minutesToRead,
  createdAt,
  published_at,
  tags,
}) => {
  const dateToShow = published_at || createdAt;
  const formattedDate = format(parseISO(dateToShow), 'MMM d, yyyy');
  const dateLabel = published_at ? 'Published' : 'Created';

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/blog/${id}`} className="block no-underline">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-700 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Category: {category}</span>
          <span className="text-sm text-gray-500">{minutesToRead ?? 'N/A'} min read</span>
        </div>
        <p className="text-sm text-gray-500">
          {dateLabel}: {formattedDate}
        </p>
      </Link>
    </div>
  );
};

const BlogIndexPage = async () => {
  const { posts, total } = await getRecentPosts(6);

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Our Blog</h1>
        <p className="text-gray-600">No posts available at the moment. Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome to Our Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      {total > 6 && (
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogIndexPage;