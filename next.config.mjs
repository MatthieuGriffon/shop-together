/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Éviter d'inclure certains modules dans le bundle côté client
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          'pg-native': false,
        };
      }
  
      return config;
    },
  };
  
  export default nextConfig;
