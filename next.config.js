/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: "localhost:8080/",
  },
};

module.exports = nextConfig;
