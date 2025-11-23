import { utapi } from '@/server/uploadthing'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        // Default limit is 500 according to UploadThing API docs
        const limit = parseInt(searchParams.get('limit') || '10', 10)
        const offset = parseInt(searchParams.get('offset') || '0', 10)

        const result = await utapi.listFiles({
            limit,
            offset,
        })

        // According to UploadThing API docs, listFiles returns an object
        // Handle the response structure - it could be an array or object with files
        let files: any[] = []
        if (Array.isArray(result)) {
            files = result
        } else if (result && typeof result === 'object') {
            // Check if it has a files property
            if ('files' in result && Array.isArray((result as any).files)) {
                files = (result as any).files
            } else {
                // If it's an object but not an array, try to extract files
                // Some APIs return { data: [...] } or similar
                files = (Object.values(result).find((val) => Array.isArray(val)) as any[]) || []
            }
        }

        // Determine if there are more files based on the returned count
        const hasMore = files.length === limit

        return NextResponse.json({
            files: files,
            hasMore: hasMore,
            total: files.length,
        })
    } catch (error) {
        console.error('Error listing files:', error)
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }
}
