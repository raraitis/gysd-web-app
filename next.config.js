/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO TEMP FIX, DROPZONE package should be fixed instead
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
