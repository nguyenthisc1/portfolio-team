import { UploadedImage } from './types'

export function resolveBaseUrl() {
    if (process.env.NEXT_PUBLIC_URL) {
        return process.env.NEXT_PUBLIC_URL
    }
    if (process.env.NEXT_PUBLIC_DASHBOARD_URL) {
        return process.env.NEXT_PUBLIC_DASHBOARD_URL
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }
    return 'http://localhost:3000'
}

export function normalizeFiles(files: any[] = []): UploadedImage[] {
    return files
        .filter((file) => file && (file.url || file.ufsUrl || file.key))
        .map((file) => {
            const url = file.url || file.ufsUrl || (file.key ? `https://utfs.io/f/${file.key}` : '')
            const name =
                file.name ||
                (file.key ? file.key.split('_').pop()?.split('/').pop() || 'Untitled' : 'Untitled')
            return {
                url,
                name,
                key: file.key || file.id || '',
                size: file.size || 0,
            }
        })
}
