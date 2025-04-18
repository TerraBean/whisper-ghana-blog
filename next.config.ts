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
};

export default nextConfig;
