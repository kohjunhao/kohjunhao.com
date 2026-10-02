import type { NextConfig } from "next";

// The essays first lived here under short slugs of their own; they now use Paragraph's.
const OLD_ARTICLE_SLUGS: Record<string, string> = {
  "convex-writeup": "write-up-on-convex",
  "web3-state-and-improvements": "web3-s-current-state-and-improvements",
  "new-protocols-q2-2022": "new-protocols-to-look-out-for-q2-2022",
  "defi-1-problems-and-road-back": "defi-1-0-the-problems-and-the-road-back-up",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(OLD_ARTICLE_SLUGS).map(([from, to]) => ({
      source: `/articles/${from}`,
      destination: `/articles/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
