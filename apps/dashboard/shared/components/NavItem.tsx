'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/src/components/Tooltip'
import { cn } from '@workspace/ui/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavItem({
    href,
    label,
    children,
}: {
    href: string
    label: string
    children: React.ReactNode
}) {
    const pathname = usePathname()
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={href}
                    className={cn(
                        'text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8',
                        {
                            'bg-accent text-black': pathname === href,
                        },
                    )}
                >
                    {children}
                    <span className="sr-only">{label}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
    )
}
