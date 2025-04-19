import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Connect to databases
    const oldDb = createPool({
      connectionString: process.env.OLD_DATABASE_URL
    });
    const newDb = createPool({
      connectionString: process.env.DATABASE_URL
    });

    console.log('Starting migration...');

    // Step 1: Create tables with UUID primary keys in new database
    await newDb.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS authors;
      DROP TABLE IF EXISTS tags;

      CREATE TABLE authors (
        id UUID PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE categories (
        id UUID PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE tags (
        id UUID PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE posts (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content JSONB,
        minutes_to_read INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE,
        published_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50),
        scheduled_publish_at TIMESTAMP WITH TIME ZONE,
        is_featured BOOLEAN DEFAULT FALSE,
        author_id UUID REFERENCES authors(id),
        category_id UUID REFERENCES categories(id)
      );

      CREATE TABLE post_tags (
        post_id UUID REFERENCES posts(id),
        tag_id UUID REFERENCES tags(id),
        PRIMARY KEY (post_id, tag_id)
      );
    `);

    // Step 2: Get all categories and authors from old database
    const categoriesResult = await oldDb.query(`
      SELECT id, name FROM categories
    `);
    console.log('Found categories:', categoriesResult.rows.length);

    // Step 3: Create categories in new database (preserving UUIDs)
    for (const category of categoriesResult.rows) {
      await newDb.query(
        'INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [category.id, category.name]
      );
    }

    // Step 4: Get all authors
    const authorsResult = await oldDb.query(`
      SELECT id, name FROM authors
    `);
    console.log('Found authors:', authorsResult.rows.length);

    // Step 5: Create authors in new database (preserving UUIDs)
    for (const author of authorsResult.rows) {
      await newDb.query(
        'INSERT INTO authors (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [author.id, author.name]
      );
    }

    // Step 6: Get all posts with their relationships
    const postsResult = await oldDb.query(`
      SELECT 
        id, title, description, content, minutes_to_read,
        created_at, updated_at, published_at, status,
        scheduled_publish_at, is_featured, author_id, category_id
      FROM posts
    `);
    console.log('Found posts:', postsResult.rows.length);

    // Step 7: Migrate posts
    for (const post of postsResult.rows) {
      try {
        await newDb.query(`
          INSERT INTO posts (
            id, title, description, content, minutes_to_read,
            created_at, updated_at, published_at, status,
            scheduled_publish_at, is_featured, author_id, category_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          ) ON CONFLICT (id) DO NOTHING
        `, [
          post.id,
          post.title,
          post.description,
          post.content,
          post.minutes_to_read,
          post.created_at,
          post.updated_at,
          post.published_at,
          post.status,
          post.scheduled_publish_at,
          post.is_featured,
          post.author_id,
          post.category_id
        ]);
      } catch (error) {
        console.error('Error migrating post:', post.id, error);
      }
    }

    // Step 8: Get and migrate tags
    const tagsResult = await oldDb.query('SELECT id, name FROM tags');
    console.log('Found tags:', tagsResult.rows.length);

    for (const tag of tagsResult.rows) {
      await newDb.query(
        'INSERT INTO tags (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [tag.id, tag.name]
      );
    }

    // Step 9: Migrate post_tags relationships
    const postTagsResult = await oldDb.query('SELECT post_id, tag_id FROM post_tags');
    console.log('Found post_tags relationships:', postTagsResult.rows.length);

    for (const postTag of postTagsResult.rows) {
      await newDb.query(
        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [postTag.post_id, postTag.tag_id]
      );
    }

    return NextResponse.json({ 
      message: "Migration completed successfully",
      stats: {
        categories: categoriesResult.rows.length,
        authors: authorsResult.rows.length,
        posts: postsResult.rows.length,
        tags: tagsResult.rows.length,
        postTags: postTagsResult.rows.length
      }
    });

  } catch (error: unknown) {
    console.error('Migration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Migration failed', details: errorMessage }, { status: 500 });
  }
}