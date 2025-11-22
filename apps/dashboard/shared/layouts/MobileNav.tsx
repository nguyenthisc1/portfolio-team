import { Button } from '@workspace/ui/components/Button'
import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/components/sheet'
import { Home, LineChart, Package, Package2, PanelLeft, ShoppingCart, Users2 } from 'lucide-react'
import Link from 'next/link'

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
                    <Link
                        href="#"
                        className="group bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">Vercel</span>
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    >
                        <Home className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Orders
                    </Link>
                    <Link href="#" className="text-foreground flex items-center gap-4 px-2.5">
                        <Package className="h-5 w-5" />
                        Products
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    >
                        <Users2 className="h-5 w-5" />
                        Customers
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    >
                        <LineChart className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
