import React from 'react'
import DesktopNav from './DeshtopNav'
import MobileNav from './MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-muted/40 flex min-h-screen w-full flex-col">
            <DesktopNav />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <MobileNav />
                    {/* <User /> */}
                </header>
                <main className="bg-muted/40 grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
                    {children}
                </main>
            </div>
        </main>
    )
}
