import { toast } from '@workspace/ui/components/Sonner'
import { UploadedImage } from './types'

export const runtime = 'nodejs'

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

export function estimateTotal(
    pageLength: number,
    offsetValue: number,
    hasMoreValue: boolean,
    perPage: number,
) {
    const startIndex = Math.max(offsetValue - perPage, 0)
    const currentCount = startIndex + pageLength
    return hasMoreValue ? currentCount + perPage : currentCount
}

export function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url)
    toast.success({
        title: 'Copied to clipboard',
        description: 'Image URL copied to clipboard',
    })
}
