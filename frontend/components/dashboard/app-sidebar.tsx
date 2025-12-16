"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NavMain } from "@/components/dashboard/nav-main"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, FileText, Home, Image as ImageIcon, Settings, Sparkles, BarChart3, Globe, ExternalLink, ChevronDown } from "lucide-react"

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

// Hook to get blog data
function useBlogData() {
    const [blogData, setBlogData] = useState({
        blogName: "My Blog",
        subdomain: "my-blog",
    })

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        fetch(`${API_URL}/blog/settings`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data && data.blogName) {
                    setBlogData(prev => ({ ...prev, ...data }))
                }
            })
            .catch(() => {
                // Use defaults
            })
    }, [])

    return blogData
}

export function AppSidebar({ className }: { className?: string }) {
    const blogData = useBlogData()
    const fullDomain = `${blogData.subdomain}.ai-blog.vercel.app`

    return (
        <div className={className}>
            {/* Blog Selector Header */}
            <div className="flex flex-col border-b px-4 py-4 lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {blogData.blogName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {fullDomain}
                        </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Link>
            </div>

            {/* View Blog Button */}
            <div className="px-4 py-3 lg:px-6 border-b">
                <a
                    href={`https://${fullDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium transition-colors group"
                >
                    <Globe className="h-4 w-4" />
                    View Blog
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-3">
                <NavMain items={sidebarItems} />
            </ScrollArea>

            {/* Upgrade Banner (Optional) */}
            <div className="p-4 lg:p-6 border-t">
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        <span className="text-sm font-semibold">AI-Powered</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Unlimited AI content generation included
                    </p>
                </div>
            </div>
        </div>
    )
}
