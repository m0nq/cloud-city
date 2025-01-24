import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production'
    },
    images: {
        // domains: ['cirquitree.com'],
        remotePatterns: [{
            protocol: 'https',
            hostname: 'cirquitree.com',
            pathname: '**'
        }]
    }
};

export default withBundleAnalyzer(nextConfig);
