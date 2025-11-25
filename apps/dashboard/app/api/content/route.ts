import { homeContentSchema } from '@/features/pages/home/components/types'
import { connectDB } from '@/shared/lib/mongodb'
import { HomeContentModel } from '@/shared/models/HomeContent'
import { NextRequest, NextResponse } from 'next/server'

function sanitizeHomeDocument(doc: Record<string, unknown>) {
    const { _id, __v, ...rest } = doc
    return rest
}

export async function GET() {
    try {
        await connectDB()

        const homeDoc = await HomeContentModel.findById('home').lean()

        return NextResponse.json(sanitizeHomeDocument(homeDoc))
    } catch (error) {
        console.error('Error loading home content:', error)
        return NextResponse.json({ error: 'Failed to load home content' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const parsed = homeContentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.format() },
                { status: 400 },
            )
        }

        await connectDB()

        const updated = await HomeContentModel.findByIdAndUpdate('home', parsed.data, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
            overwrite: true,
        }).lean()

        return NextResponse.json({
            success: true,
            data: sanitizeHomeDocument(updated ?? parsed.data),
        })
    } catch (error) {
        console.error('Error updating home content:', error)
        return NextResponse.json(
            {
                error: 'Failed to update home content',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        )
    }
}
