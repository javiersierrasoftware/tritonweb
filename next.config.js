/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,       // ⬅ DESACTIVA OPTIMIZACIÓN (evita crash en Heroku)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;