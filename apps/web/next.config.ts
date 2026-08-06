import type { NextConfig } from 'next';

const allowedDevOrigins = [
  '*.agent.cvm.dev',
  '*.cvm.dev',
  ...(process.env.ALLOWED_DEV_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []),
];

const nextConfig: NextConfig = {
  transpilePackages: ['@notonlyhere/ui', '@notonlyhere/contracts'],
  outputFileTracingRoot: require('path').join(__dirname, '../..'),
  allowedDevOrigins,
};

export default nextConfig;
