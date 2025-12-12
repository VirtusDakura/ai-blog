"use client"

import Link from "next/link"
import { NavMain } from "@/components/dashboard/nav-main"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, FileText, Home, Image as ImageIcon, Settings, Sparkles, BarChart3 } from "lucide-react"

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Posts",
        href: "/dashboard/posts",
        icon: FileText,
    },
    {
        title: "AI Tools",
        href: "/dashboard/ai",
        icon: Sparkles,
    },
    {
        title: "Media",
        href: "/dashboard/media",
        icon: ImageIcon,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
]

export function AppSidebar({ className }: { className?: string }) {
    return (
        <div className={className}>
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-6 w-6" />
                    <span className="">AI Blog CMS</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 px-3 py-3">
                <NavMain items={sidebarItems} />
            </ScrollArea>
        </div>
    )
}

