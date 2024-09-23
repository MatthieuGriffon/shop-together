/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify : false,
  images: {
    domains: ['lh3.googleusercontent.com', 'graph.facebook.com', 'graph.facebook.com', 'platform-lookaside.fbsbx.com'],  // Ajoute ce domaine pour les images Google
  },
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