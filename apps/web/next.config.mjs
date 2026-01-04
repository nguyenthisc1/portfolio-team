/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui'],
    images: {
        domains: ['utfs.io'],
    },
}

export default nextConfig
