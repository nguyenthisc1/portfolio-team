import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const PAGES_JSON_PATH = join(process.cwd(), 'db/pages.json')

export async function GET() {
    try {
        const fileContent = await readFile(PAGES_JSON_PATH, 'utf-8')
        const data = JSON.parse(fileContent)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error reading pages.json:', error)
        return NextResponse.json({ error: 'Failed to read pages.json' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate that body is an object
        if (typeof body !== 'object' || body === null) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
        }

        // Read existing pages
        const fileContent = await readFile(PAGES_JSON_PATH, 'utf-8')
        const pages = JSON.parse(fileContent)

        // Add new page
        const newPage = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        pages.push(newPage)

        // Write the updated data to the file
        await writeFile(PAGES_JSON_PATH, JSON.stringify(pages, null, 2), 'utf-8')

        return NextResponse.json({ success: true, data: newPage })
    } catch (error) {
        console.error('Error creating page:', error)
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
    }
}
