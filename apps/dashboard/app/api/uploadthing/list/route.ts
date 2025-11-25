import { utapi } from 'server/uploadthing'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const limit = Math.max(parseInt(searchParams.get('limit') || '10', 10), 1)
        const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

        const result = await utapi.listFiles({
            limit,
            offset,
        })

        let files: any[] = []
        if (Array.isArray(result)) {
            files = result
        } else if (result && typeof result === 'object') {
            if ('files' in result && Array.isArray((result as any).files)) {
                files = (result as any).files
            } else {
                files = (Object.values(result).find((val) => Array.isArray(val)) as any[]) || []
            }
        }

        return NextResponse.json({
            files,
            hasMore: files.length === limit,
            limit,
            offset,
        })
    } catch (error) {
        console.error('Error listing files:', error)
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }
}
