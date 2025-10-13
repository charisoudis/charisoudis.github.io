import {withContentlayer} from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: '**'}
        ]
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['*']
        }
    },
    webpack(config) {
        config.ignoreWarnings = [
            ...(config.ignoreWarnings || []),
            (w) =>
                typeof w?.message === 'string' &&
                w.message.includes('@contentlayer/core') &&
                w.message.includes('generate-dotpkg.js') &&
                w.message.includes('incorrect cache invalidation'),
        ]
        return config
    },
}

export default withContentlayer(nextConfig)
