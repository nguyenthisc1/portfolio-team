import { connectDB } from '@/shared/lib/mongodb'
import { GlobalSettingsModel } from '@/shared/models/GlobalSettings'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const urlOrEmpty = z.union([z.string().url(), z.literal('')])

const globalSettingsSchema = z.object({
    siteName: z.string().min(1, 'Site name is required'),
    logo: urlOrEmpty.optional(),
    footerText: z.string().optional(),
    socialLinks: z.record(urlOrEmpty).optional(),
})

const DEFAULT_SETTINGS = {
    _id: 'global_settings',
    siteName: 'Thi Nguyen Portfolio',
    logo: '',
    footerText: '© 2025 Thi Nguyen',
    socialLinks: {
        github: 'https://github.com/thi',
        linkedin: 'https://linkedin.com/in/thi',
    },
}

function sanitizeSettings(doc: Record<string, unknown>) {
    const { _id, __v, ...rest } = doc
    if (rest.socialLinks instanceof Map) {
        rest.socialLinks = Object.fromEntries(rest.socialLinks.entries())
    }
    return rest
}

export async function GET() {
    try {
        await connectDB()
        let settings = await GlobalSettingsModel.findById('global_settings').lean()

        if (!settings) {
            settings = (await GlobalSettingsModel.create(DEFAULT_SETTINGS)).toObject()
        }

        return NextResponse.json(sanitizeSettings(settings))
    } catch (error) {
        console.error('Error loading global settings:', error)
        return NextResponse.json({ error: 'Failed to load global settings' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const parsed = globalSettingsSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.format() },
                { status: 400 },
            )
        }

        await connectDB()

        const updated = await GlobalSettingsModel.findByIdAndUpdate(
            'global_settings',
            parsed.data,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
                overwrite: true,
            },
        ).lean()

        return NextResponse.json({
            success: true,
            data: sanitizeSettings(updated ?? parsed.data),
        })
    } catch (error) {
        console.error('Error updating global settings:', error)
        return NextResponse.json(
            {
                error: 'Failed to update global settings',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        )
    }
}
