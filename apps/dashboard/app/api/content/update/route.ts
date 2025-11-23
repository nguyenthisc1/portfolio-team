import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const HOME_JSON_PATH = join(process.cwd(), 'db/home.json')

export async function GET() {
    try {
        const fileContent = await readFile(HOME_JSON_PATH, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error reading home.json:', error)
        return NextResponse.json({ error: 'Failed to read home.json' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate that body is an object
        if (typeof body !== 'object' || body === null) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }

        console.log('Writing to:', HOME_JSON_PATH)
        console.log('Current working directory:', process.cwd())

        // Write the updated data to the file
        await writeFile(HOME_JSON_PATH, JSON.stringify(body, null, 4), 'utf-8')

        return NextResponse.json({ success: true, data: body })
    } catch (error) {
        console.error('Error updating home.json:', error)
        console.error('Error details:', error instanceof Error ? error.message : String(error))
        return NextResponse.json(
            {
                error: 'Failed to update home.json',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        )
    }
}
