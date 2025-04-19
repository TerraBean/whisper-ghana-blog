import { NextAuthOptions } from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route';

// Helper function to get server session that works with Next.js App Router
export const getServerSession = async () => {
  // Use a dynamic import for the Auth.js function
  const { getServerSession: getSession } = await import('next-auth');
  return getSession(authOptions);
};

/**
 * Get the user's session on the server side
 */
export async function auth() {
  return await getServerSession();
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session;
}

/**
 * Get the authenticated user's info
 */
export async function getUser() {
  const session = await auth();
  return session?.user || null;
}
