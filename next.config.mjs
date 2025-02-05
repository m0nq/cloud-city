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
            }
        ]
    }
    // experimental: {
    //     reactCompiler: true
    // }
};

export default withBundleAnalyzer(nextConfig);
