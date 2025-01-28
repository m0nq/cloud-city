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
    // experimental: {
    //     reactCompiler: true
    // }
};

export default withBundleAnalyzer(nextConfig);
