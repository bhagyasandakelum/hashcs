/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "media.graphassets.com",        // older domain
      "ap-south-1.graphassets.com",   // your new domain causing error
    ],
  },
};

export default nextConfig;
