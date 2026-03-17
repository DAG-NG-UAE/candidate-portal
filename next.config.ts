import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // <--- Add this line
  images: {
    unoptimized: true, // Static exports don't support Next.js Image Optimization
  },
};

export default nextConfig;
