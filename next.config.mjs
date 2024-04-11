/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gpt.hyochan.dev",
        port: '',
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
