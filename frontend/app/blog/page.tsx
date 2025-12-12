"use client"

import Link from "next/link"
import Image from "next/image"
import { usePosts } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar, ArrowRight, Sparkles, ChevronRight } from "lucide-react"

function PostCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
        </Card>
    )
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

function getInitials(firstName?: string | null, lastName?: string | null, email?: string) {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (email) {
        return email[0].toUpperCase()
    }
    return "U"
}

export default function BlogHomePage() {
    const { data, isLoading, error } = usePosts({ published: true, take: 12 })

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

                <div className="relative container mx-auto px-4 py-24 lg:py-32">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm border border-primary/20">
                            <Sparkles className="h-4 w-4" />
                            AI-Powered Content Platform
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text">
                            Discover Amazing Stories
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
                            Explore thought-provoking articles, tutorials, and insights crafted with the power of AI and human creativity.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Button size="lg" asChild className="group">
                                <Link href="/dashboard">
                                    Start Writing
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="#latest">
                                    Browse Articles
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span>AI Blog</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/blog" className="text-sm font-medium text-primary">
                            Articles
                        </Link>
                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Sign In
                        </Link>
                        <Button asChild size="sm">
                            <Link href="/register">Get Started</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Latest Posts Section */}
            <section id="latest" className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
                        <p className="text-muted-foreground mt-2">Fresh perspectives and insights from our writers</p>
                    </div>
                </div>

                {error && (
                    <div className="text-center py-12">
                        <p className="text-destructive">Failed to load posts. Please try again later.</p>
                    </div>
                )}

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {data && data.data.length === 0 && (
                    <div className="text-center py-24 border rounded-lg border-dashed">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                        <p className="text-muted-foreground mb-6">Be the first to share your knowledge</p>
                        <Button asChild>
                            <Link href="/dashboard/posts/new">Create Your First Post</Link>
                        </Button>
                    </div>
                )}

                {data && data.data.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.data.map((post) => (
                            <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/50 hover:border-primary/20">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>

                                <CardHeader className="pb-2">
                                    <Link href={`/blog/${post.slug}`}>
                                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                    </Link>
                                </CardHeader>

                                <CardContent className="pb-3">
                                    {post.excerpt && (
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </CardContent>

                                <CardFooter className="pt-0 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={post.author?.avatarUrl || undefined} />
                                            <AvatarFallback className="text-xs">
                                                {getInitials(post.author?.firstName, post.author?.lastName, post.author?.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">
                                            {post.author?.firstName || post.author?.email?.split("@")[0]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {post.publishedAt && formatDate(post.publishedAt)}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {data && data.meta.hasMore && (
                    <div className="flex justify-center mt-12">
                        <Button variant="outline" size="lg" className="group">
                            Load More Articles
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t bg-muted/30">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="font-semibold">AI Blog Platform</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} AI Blog Platform. All rights reserved.
                        </p>
                        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/blog" className="hover:text-foreground transition-colors">Articles</Link>
                            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}
