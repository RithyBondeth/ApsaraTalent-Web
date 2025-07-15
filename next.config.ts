import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["localhost"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allows images from all domains
            },
        ],
    },
};

export default nextConfig;
