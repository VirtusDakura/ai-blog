"use client"

import Link from "next/link"
import Image from "next/image"
import { usePosts } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar, ArrowRight, Clock, Search, Menu, X } from "lucide-react"
import { useState } from "react"

function PostCardSkeleton() {
    return (
        <article className="group">
            <Skeleton className="aspect-16/10 rounded-2xl mb-4" />
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-7 w-full mb-2" />
            <Skeleton className="h-7 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
        </article>
    )
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

function getReadingTime(content?: string) {
    if (!content) return "3 min read"
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}

function getInitials(firstName?: string | null, lastName?: string | null, email?: string) {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (email) {
        return email[0].toUpperCase()
    }
    return "A"
}

export default function BlogHomePage() {
    const { data, isLoading, error } = usePosts({ published: true, take: 12 })
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const featuredPost = data?.data[0]
    const recentPosts = data?.data.slice(1, 7) || []

    return (
        <div className="min-h-screen bg-background font-inter">
            {/* Navigation - Clean and minimal */}
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/blog" className="flex items-center gap-2.5 group">
                            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">The Blog</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/blog" className="text-sm font-medium text-foreground hover:text-violet-600 transition-colors">
                                Articles
                            </Link>
                            <Link href="/blog#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Categories
                            </Link>
                            <Link href="/blog#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                About
                            </Link>
                        </nav>

                        {/* Search & Mobile Menu */}
                        <div className="flex items-center gap-3">
                            <button className="p-2.5 rounded-xl hover:bg-muted transition-colors" aria-label="Search">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </button>
                            <button
                                className="p-2.5 rounded-xl hover:bg-muted transition-colors md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden py-4 border-t border-border/40">
                            <div className="flex flex-col gap-2">
                                <Link href="/blog" className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                                    Articles
                                </Link>
                                <Link href="/blog#categories" className="px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors">
                                    Categories
                                </Link>
                                <Link href="/blog#about" className="px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted transition-colors">
                                    About
                                </Link>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="py-16 sm:py-24 border-b border-border/40">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                                Ideas, stories, and
                                <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> insights</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                Discover thoughtful articles on technology, design, and the future.
                                Written for curious minds who love to learn.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured Post */}
                {!isLoading && featuredPost && (
                    <section className="py-12 sm:py-16">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6">
                            <Link href={`/blog/${featuredPost.slug}`} className="group block">
                                <article className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20">
                                        {featuredPost.coverImage ? (
                                            <Image
                                                src={featuredPost.coverImage}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="h-16 w-16 text-violet-300 dark:text-violet-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium mb-4">
                                            <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30">
                                                Featured
                                            </span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 group-hover:text-violet-600 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        {featuredPost.excerpt && (
                                            <p className="text-muted-foreground text-lg leading-relaxed mb-6 line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                                    {getInitials(featuredPost.author?.firstName, featuredPost.author?.lastName, featuredPost.author?.email)}
                                                </div>
                                                <span className="font-medium text-foreground">
                                                    {featuredPost.author?.firstName || featuredPost.author?.email?.split("@")[0] || "Author"}
                                                </span>
                                            </div>
                                            <span className="text-border">•</span>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                {featuredPost.publishedAt && formatDate(featuredPost.publishedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Recent Articles */}
                <section className="py-12 sm:py-16 border-t border-border/40">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Recent Articles</h2>
                            <Link
                                href="/blog/archive"
                                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                View all
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        {error && (
                            <div className="text-center py-16 rounded-2xl bg-muted/30 border border-border/50">
                                <p className="text-muted-foreground">Unable to load articles. Please try again later.</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <PostCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {data && data.data.length === 0 && (
                            <div className="text-center py-24 rounded-2xl bg-muted/30 border border-dashed border-border">
                                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No articles yet</h3>
                                <p className="text-muted-foreground">
                                    Check back soon for new content.
                                </p>
                            </div>
                        )}

                        {recentPosts.length > 0 && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {recentPosts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                        <article>
                                            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mb-4">
                                                {post.coverImage ? (
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                                                <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
                                                <span className="text-border">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {getReadingTime(post.content)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Mobile View All Link */}
                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                href="/blog/archive"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
                            >
                                View all articles
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Newsletter / About Section */}
                <section id="about" className="py-16 sm:py-24 bg-linear-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-t border-border/40">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                                Stay curious
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                We share ideas about technology, creativity, and the future.
                                Bookmark this page and check back for new articles.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/20 transition-all"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Browse All Articles
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-muted/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-semibold">The Blog</span>
                        </div>
                        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/blog" className="hover:text-foreground transition-colors">Articles</Link>
                            <Link href="/blog#about" className="hover:text-foreground transition-colors">About</Link>
                            <Link href="/blog#categories" className="hover:text-foreground transition-colors">Categories</Link>
                        </nav>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} The Blog. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
