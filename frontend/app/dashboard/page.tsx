"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { usePosts } from "@/hooks/use-api"
import { useBlog, getBlogUrl } from "@/contexts/blog-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    PlusCircle,
    FileText,
    Eye,
    Clock,
    TrendingUp,
    Sparkles,
    ArrowRight,
    BookOpen,
    Globe,
    Palette,
    Settings,
    Users,
    BarChart3,
    CheckCircle2,
    Circle,
    ExternalLink,
    Copy,
    Rocket,
    Zap,
    PenTool,
    Image,
    Share2,
    X,
    Loader2
} from "lucide-react"

// Getting Started Tasks
const GETTING_STARTED_TASKS = [
    { id: "profile", label: "Complete your profile", icon: Users, href: "/dashboard/settings" },
    { id: "first-post", label: "Write your first post", icon: PenTool, href: "/dashboard/posts/new" },
    { id: "add-image", label: "Add a featured image", icon: Image, href: "/dashboard/media" },
    { id: "publish", label: "Publish your first article", icon: Rocket, href: "/dashboard/posts" },
    { id: "share", label: "Share your blog", icon: Share2, href: "#" },
]

function StatsCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
        </Card>
    )
}

function PostItemSkeleton() {
    return (
        <div className="flex items-center gap-4 py-3">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    })
}

function DashboardContent() {
    const searchParams = useSearchParams()
    const isWelcome = searchParams.get("welcome") === "true"
    const [showWelcome, setShowWelcome] = useState(isWelcome)
    const [completedTasks, setCompletedTasks] = useState<string[]>([])
    const [copiedDomain, setCopiedDomain] = useState(false)

    // Use the blog context for real data
    const blog = useBlog()
    const { data, isLoading } = usePosts({ take: 5 })

    const totalPosts = data?.meta.total || 0
    const publishedPosts = data?.data.filter(p => p.isPublished).length || 0
    const draftPosts = data?.data.filter(p => !p.isPublished).length || 0

    // Get the full blog URL
    const blogUrl = getBlogUrl(blog.subdomain, blog.customDomain)
    const displayDomain = blog.customDomain || `${blog.subdomain}.ai-blog.vercel.app`

    const toggleTask = (taskId: string) => {
        setCompletedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        )
    }

    const copyDomain = () => {
        navigator.clipboard.writeText(blogUrl)
        setCopiedDomain(true)
        setTimeout(() => setCopiedDomain(false), 2000)
    }

    const completionPercentage = Math.round((completedTasks.length / GETTING_STARTED_TASKS.length) * 100)

    // Show loading state while fetching blog data
    if (blog.isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Welcome Banner - Only shown after onboarding */}
            {showWelcome && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white">
                    {/* Background Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setShowWelcome(false)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                <Rocket className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Welcome to {blog.blogName}! 🎉</h2>
                                <p className="text-white/80">Your blog is ready. Let's make it awesome!</p>
                            </div>
                        </div>

                        {/* Blog URL - Fully Functional */}
                        <div className="flex items-center gap-3 mt-6">
                            <a
                                href={blogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                            >
                                <Globe className="h-4 w-4" />
                                <span className="font-mono text-sm">{displayDomain}</span>
                            </a>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={copyDomain}
                                className="bg-white/20 hover:bg-white/30 border-0"
                            >
                                {copiedDomain ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                asChild
                                className="bg-white/20 hover:bg-white/30 border-0"
                            >
                                <a href={blogUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header with Blog Info */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{blog.blogName}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                                href={blogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground font-mono text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                {displayDomain}
                            </a>
                            <button
                                onClick={copyDomain}
                                className="p-1 hover:bg-muted rounded transition-colors"
                                title="Copy URL"
                            >
                                {copiedDomain ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                            </button>
                            <a
                                href={blogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 hover:bg-muted rounded transition-colors"
                                title="Visit Blog"
                            >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-violet-600" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="lg" asChild>
                        <a href={blogUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Blog
                        </a>
                    </Button>
                    <Button asChild size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 group">
                        <Link href="/dashboard/posts/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Post
                            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    <>
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                        <StatsCardSkeleton />
                    </>
                ) : (
                    <>
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Posts
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-violet-500/10">
                                    <FileText className="h-4 w-4 text-violet-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalPosts}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    All your content
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Published
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <Eye className="h-4 w-4 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {publishedPosts}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Live articles
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Drafts
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                    {draftPosts}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    In progress
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Page Views
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <BarChart3 className="h-4 w-4 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    0
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    This month
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Getting Started Checklist */}
                <Card className="lg:col-span-1 border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-violet-500" />
                                Getting Started
                            </CardTitle>
                            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                {completionPercentage}%
                            </span>
                        </div>
                        <CardDescription>
                            Complete these steps to set up your blog
                        </CardDescription>
                        {/* Progress Bar */}
                        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {GETTING_STARTED_TASKS.map((task) => (
                            <button
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`
                                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                                    ${completedTasks.includes(task.id)
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                        : "hover:bg-muted"
                                    }
                                `}
                            >
                                {completedTasks.includes(task.id) ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className={completedTasks.includes(task.id) ? "line-through" : ""}>
                                    {task.label}
                                </span>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Recent Posts
                        </CardTitle>
                        <CardDescription>
                            Your latest blog content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <PostItemSkeleton />
                                <PostItemSkeleton />
                                <PostItemSkeleton />
                            </div>
                        ) : data?.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                                    <PenTool className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                                <h3 className="font-semibold mb-1">No posts yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start creating amazing content with AI assistance
                                </p>
                                <Button asChild className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                                    <Link href="/dashboard/posts/new">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Create Your First Post
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {data?.data.slice(0, 5).map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/dashboard/posts/${post.id}/edit`}
                                        className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-muted transition-colors group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                {post.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(post.createdAt)}
                                            </p>
                                        </div>
                                        <Badge variant={post.isPublished ? "success" : "warning"}>
                                            {post.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    {data?.data && data.data.length > 0 && (
                        <CardFooter className="border-t pt-4">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/dashboard/posts">
                                    View All Posts
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/dashboard/posts/new"
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                    >
                        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                            <PlusCircle className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">New Post</p>
                            <p className="text-sm text-muted-foreground">Create with AI</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/ai"
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                    >
                        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">AI Tools</p>
                            <p className="text-sm text-muted-foreground">Generate content</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/analytics"
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                    >
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">Analytics</p>
                            <p className="text-sm text-muted-foreground">View statistics</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                    >
                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold">Settings</p>
                            <p className="text-sm text-muted-foreground">Configure blog</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Loading fallback
function DashboardLoading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardLoading />}>
            <DashboardContent />
        </Suspense>
    )
}
