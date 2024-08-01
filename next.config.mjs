/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIREBASE_API: process.env.FIREBASE_API,
  },
};

export default nextConfig;
