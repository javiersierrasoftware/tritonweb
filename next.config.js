/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // ⬅ DESACTIVA OPTIMIZACIÓN (evita crash en Heroku)
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },


};

module.exports = nextConfig;
