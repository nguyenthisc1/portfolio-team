/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui'],
    images: {
        domains: ['images.unsplash.com', 'utfs.io'],
    },
    // basePath: '/dashboard'
}

export default nextConfig
