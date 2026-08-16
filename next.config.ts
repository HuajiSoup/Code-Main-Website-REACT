import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL("https://api.huaji-universe.top/**")
    ]
  },
  sassOptions: {
    additionalData: '@use "@/styles/variables" as *;',
  }
};

export default nextConfig;
