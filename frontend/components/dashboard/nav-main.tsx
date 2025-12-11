"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavItem {
    title: string
    href: string
    icon: LucideIcon
    variant?: "default" | "ghost"
}

interface NavProps {
    items: NavItem[]
}

export function NavMain({ items }: NavProps) {
    const pathname = usePathname()

    return (
        <nav className="grid items-start gap-2">
            {items.map((item, index) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            buttonVariants({ variant: isActive ? "default" : "ghost", size: "sm" }),
                            "justify-start text-sm font-medium transition-colors"
                        )}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    )
}
