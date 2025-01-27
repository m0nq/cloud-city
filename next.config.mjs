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
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cirquitree.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'notion.so',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
                pathname: '**'
            }
        ]
    }
};

export default withBundleAnalyzer(nextConfig);
