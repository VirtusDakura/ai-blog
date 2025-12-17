"use client"

import Link from "next/link"
import { NavMain } from "@/components/dashboard/nav-main"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useBlog, getBlogUrl, getDisplayDomain } from "@/contexts/blog-context"
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

export function AppSidebar({ className }: { className?: string }) {
    const blog = useBlog()
    // blogUrl links to /blog during development (functional link)
    const blogUrl = getBlogUrl(blog.subdomain, blog.customDomain)
    // displayDomain shows what the subdomain will be when deployed (for display)
    const displayDomain = getDisplayDomain(blog.subdomain, blog.customDomain)

    return (
        <div className={className}>
            {/* Blog Selector Header */}
            <div className="flex flex-col border-b px-4 py-4 lg:px-6">
                {blog.isLoading ? (
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32 mt-1" />
                        </div>
                    </div>
                ) : (
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                {blog.blogName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {displayDomain}
                            </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Link>
                )}
            </div>

            {/* View Blog Button - Links to /blog page (functional) */}
            <div className="px-4 py-3 lg:px-6 border-b">
                <Link
                    href="/blog"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium transition-colors group"
                >
                    <Globe className="h-4 w-4" />
                    View Blog
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-3">
                <NavMain items={sidebarItems} />
            </ScrollArea>

            {/* Upgrade Banner */}
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
