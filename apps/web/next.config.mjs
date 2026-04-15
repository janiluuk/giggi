/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["http://127.0.0.1:3100", "http://localhost:3100"],
  transpilePackages: ["@giggi/domain"]
};

export default nextConfig;
