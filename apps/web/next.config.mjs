/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@depilmoni/core", "@depilmoni/ui"],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
