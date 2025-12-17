"use client"

import Link from "next/link"
import { NavMain } from "@/components/dashboard/nav-main"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useBlog, getBlogUrl, getDisplayDomain } from "@/contexts/blog-context"
import { BookOpen, FileText, Home, Image as ImageIcon, Settings, Sparkles, BarChart3, Globe, ExternalLink, ChevronDown, AlertCircle } from "lucide-react"

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

    // Get display values - handle empty/missing data
    const blogName = blog.blogName || 'Setup Required'
    const displayDomain = blog.subdomain
        ? getDisplayDomain(blog.subdomain, blog.customDomain)
        : 'Complete onboarding'
    const needsSetup = !blog.blogName || !blog.subdomain

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
                        <div className={`p-2 rounded-xl text-white shadow-lg ${needsSetup ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20' : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-500/20'}`}>
                            {needsSetup ? <AlertCircle className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                {blogName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {displayDomain}
                            </p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Link>
                )}
            </div>

            {/* View Blog Button or Setup Prompt */}
            <div className="px-4 py-3 lg:px-6 border-b">
                {needsSetup ? (
                    <Link
                        href="/onboarding"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium transition-colors hover:from-violet-600 hover:to-purple-700"
                    >
                        <Sparkles className="h-4 w-4" />
                        Complete Setup
                    </Link>
                ) : (
                    <Link
                        href="/blog"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-muted/50 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium transition-colors group"
                    >
                        <Globe className="h-4 w-4" />
                        View Blog
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                )}
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
