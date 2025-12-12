"use client"

import Link from "next/link"
import { usePosts } from "@/hooks/use-api"
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
    BookOpen
} from "lucide-react"

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

export default function DashboardPage() {
    const { data, isLoading } = usePosts({ take: 5 })

    const totalPosts = data?.meta.total || 0
    const publishedPosts = data?.data.filter(p => p.isPublished).length || 0
    const draftPosts = data?.data.filter(p => !p.isPublished).length || 0

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back! Here&apos;s what&apos;s happening with your blog.
                    </p>
                </div>
                <Button asChild size="lg" className="group">
                    <Link href="/dashboard/posts/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </Button>
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
                        <Card className="border-l-4 border-l-primary">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Posts
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalPosts}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    All your content in one place
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Published
                                </CardTitle>
                                <Eye className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {publishedPosts}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Live and visible to readers
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-amber-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Drafts
                                </CardTitle>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                    {draftPosts}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Work in progress
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-violet-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    AI Powered
                                </CardTitle>
                                <Sparkles className="h-4 w-4 text-violet-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                                    ∞
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Unlimited AI generations
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Posts */}
                <Card>
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
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground">No posts yet</p>
                                <Button variant="link" asChild className="mt-2">
                                    <Link href="/dashboard/posts/new">Create your first post</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {data?.data.slice(0, 5).map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/dashboard/posts/${post.id}/edit`}
                                        className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-muted transition-colors group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate group-hover:text-primary transition-colors">
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
                    <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/posts">
                                View All Posts
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Common tasks to boost productivity
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link
                            href="/dashboard/posts/new"
                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <PlusCircle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    Create New Post
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Write a new article with AI assistance
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link
                            href="/dashboard/posts"
                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    Manage Posts
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Edit, publish, or delete your content
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link
                            href="/blog"
                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                <Eye className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    View Blog
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    See your public blog page
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    AI Settings
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Configure AI generation preferences
                                </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
