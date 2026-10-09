import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Waveform Arcade (CartNova) is a static site in public/arcade; serve it at /arcade.
  async rewrites() {
    return [{ source: "/arcade", destination: "/arcade/index.html" }];
  },
};

export default nextConfig;
