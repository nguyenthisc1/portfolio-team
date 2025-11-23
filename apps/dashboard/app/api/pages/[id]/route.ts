import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const PAGES_JSON_PATH = join(process.cwd(), 'db/pages.json')

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const fileContent = await readFile(PAGES_JSON_PATH, 'utf-8')
        const pages = JSON.parse(fileContent)
        const page = pages.find((p: any) => p.id === id)

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        return NextResponse.json(page)
    } catch (error) {
        console.error('Error reading page:', error)
        return NextResponse.json({ error: 'Failed to read page' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()

        const fileContent = await readFile(PAGES_JSON_PATH, 'utf-8')
        const pages = JSON.parse(fileContent)
        const pageIndex = pages.findIndex((p: any) => p.id === id)

        if (pageIndex === -1) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        // Update page
        pages[pageIndex] = {
            ...pages[pageIndex],
            ...body,
            updatedAt: new Date().toISOString(),
        }

        await writeFile(PAGES_JSON_PATH, JSON.stringify(pages, null, 2), 'utf-8')

        return NextResponse.json({ success: true, data: pages[pageIndex] })
    } catch (error) {
        console.error('Error updating page:', error)
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params

        const fileContent = await readFile(PAGES_JSON_PATH, 'utf-8')
        const pages = JSON.parse(fileContent)
        const filteredPages = pages.filter((p: any) => p.id !== id)

        if (pages.length === filteredPages.length) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        await writeFile(PAGES_JSON_PATH, JSON.stringify(filteredPages, null, 2), 'utf-8')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting page:', error)
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
    }
}
