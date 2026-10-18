import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: { agentFeedback: true },
  turbopack: { root: process.cwd() },
};
export default nextConfig;
