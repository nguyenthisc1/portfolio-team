import { Button } from '@workspace/ui/src/components/Button'
import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/src/components/sheet'
import { PanelLeft } from 'lucide-react'
import Link from 'next/link'
import { NAVIGATION } from '../consts/common'

export default function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                    {NAVIGATION.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
                        >
                            {item.icon && (
                                <item.icon className="h-5 w-5 transition-all group-hover:scale-110" />
                            )}
                            <span className="sr-only">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
