"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/dashboard/mode-toggle"
import { NavUser } from "@/components/dashboard/nav-user"
import { AppSidebar } from "@/components/dashboard/app-sidebar"

export function DashboardHeader() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                    <AppSidebar className="flex h-full flex-col" />
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">

            </div>
            <ModeToggle />
            <NavUser />
        </header>
    )
}
