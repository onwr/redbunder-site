import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Eski şube bazlı menü adresleri (/menu/kizilay) → menü sayfası
      { source: "/menu/:slug", destination: "/menu", permanent: false },
    ];
  },
};

export default nextConfig;
