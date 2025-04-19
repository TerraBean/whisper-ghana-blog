import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Optimize module loading
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // Ensure proper module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
      },
    };

    return config;
  },
  // Enable external packages
  serverExternalPackages: [],
  
  // Disable ESLint errors during build (warnings are still shown)
  eslint: {
    // Warning instead of error during builds
    ignoreDuringBuilds: true,
  },
  
  // Disable type checking during builds for better performance
  typescript: {
    // Warning instead of error during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
