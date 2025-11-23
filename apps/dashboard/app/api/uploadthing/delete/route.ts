import { utapi } from '@/server/uploadthing'

export async function POST(req: Request) {
    const { key } = await req.json()

    if (!key) return Response.json({ error: 'Missing file key' }, { status: 400 })

    const deleted = await utapi.deleteFiles(key)

    return Response.json({ success: true, deleted })
}
