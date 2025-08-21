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
        // Optimize image caching and performance
        minimumCacheTTL: 3600, // Cache images for 1 hour minimum
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        formats: ['image/avif', 'image/webp'], // Use modern formats for better compression
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    // Add headers for better caching
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
