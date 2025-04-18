import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; // Example provider

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace with your actual authentication logic
        if (credentials?.username === 'admin' && credentials?.password === 'password') {
          return { id: '1', name: 'admin' }; // Example user
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page (optional)
  },
  session: {
    strategy: 'jwt' as 'jwt', // Use JWT for session management
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };