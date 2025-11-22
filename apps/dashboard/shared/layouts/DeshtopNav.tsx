import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/Tooltip'
import { Home, Settings } from 'lucide-react'
import Link from 'next/link'
import NavItem from '../components/NavItem'

export default function DesktopNav() {
    return (
        <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs"
                    className="group bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
                >
                    {/* <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" /> */}
                    <span className="sr-only">Acme Inc</span>
                </Link>

                <NavItem href="#" label="Dashboard">
                    <Home className="h-5 w-5" />
                </NavItem>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}
