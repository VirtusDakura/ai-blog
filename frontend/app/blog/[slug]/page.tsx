import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, Clock, ArrowLeft, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentsWrapper } from "./comments-wrapper"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface Post {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    coverImage: string | null
    isPublished: boolean
    publishedAt: string | null
    seoTitle: string | null
    seoDescription: string | null
    seoKeywords: string[]
    createdAt: string
    author: {
        id: string
        firstName: string | null
        lastName: string | null
        email: string
        avatarUrl: string | null
    }
    _count: {
        comments: number
    }
}

async function getPost(slug: string): Promise<Post | null> {
    try {
        const res = await fetch(`${API_URL}/posts/slug/${slug}`, {
            next: { revalidate: 60 }
        })

        if (!res.ok) {
            return null
        }

        return res.json()
    } catch (error) {
        console.error("Failed to fetch post:", error)
        return null
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        return {
            title: "Post Not Found"
        }
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || undefined,
        keywords: post.seoKeywords,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || undefined,
            type: "article",
            publishedTime: post.publishedAt || undefined,
            authors: [post.author.firstName ? `${post.author.firstName} ${post.author.lastName || ""}` : post.author.email],
            images: post.coverImage ? [post.coverImage] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || undefined,
            images: post.coverImage ? [post.coverImage] : undefined,
        }
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

function getReadingTime(content: string) {
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

// Share Button Component
function ShareButton({ icon: Icon, label, onClick }: { icon: typeof Twitter; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-2.5 rounded-xl border border-border/50 hover:bg-muted hover:border-border transition-all"
            aria-label={label}
        >
            <Icon className="h-4 w-4 text-muted-foreground" />
        </button>
    )
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post || !post.isPublished) {
        notFound()
    }

    const authorName = post.author.firstName
        ? `${post.author.firstName} ${post.author.lastName || ""}`.trim()
        : post.author.email.split("@")[0]

    return (
        <div className="min-h-screen bg-background font-inter">
            {/* Navigation - Clean and minimal */}
            <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/blog" className="flex items-center gap-2.5 group">
                            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">The Blog</span>
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                All Articles
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <article className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Back Navigation */}
                <div className="py-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to Articles
                    </Link>
                </div>

                {/* Article Header */}
                <header className="pb-8">
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
                        </div>
                        <span className="text-border">•</span>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{getReadingTime(post.content)}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-6">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                            <AvatarImage src={post.author.avatarUrl || undefined} />
                            <AvatarFallback className="bg-linear-to-br from-violet-500 to-purple-600 text-white font-medium">
                                {getInitials(post.author.firstName, post.author.lastName, post.author.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{authorName}</p>
                            <p className="text-sm text-muted-foreground">Author</p>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Article Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-12 prose-headings:mb-4
                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-blockquote:border-l-violet-500 prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
                        prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:shadow-lg
                        prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Share Section */}
                <div className="border-t border-border/40 mt-16 pt-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <p className="text-sm font-medium text-muted-foreground">Share this article</p>
                        <div className="flex items-center gap-2">
                            <ShareButton
                                icon={Twitter}
                                label="Share on Twitter"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
                                    }
                                }}
                            />
                            <ShareButton
                                icon={Facebook}
                                label="Share on Facebook"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                                    }
                                }}
                            />
                            <ShareButton
                                icon={Linkedin}
                                label="Share on LinkedIn"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
                                    }
                                }}
                            />
                            <ShareButton
                                icon={Copy}
                                label="Copy link"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        navigator.clipboard.writeText(window.location.href)
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Author Bio */}
                <section className="border-t border-border/40 mt-8 pt-12">
                    <div className="flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8 rounded-2xl bg-linear-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                            <AvatarImage src={post.author.avatarUrl || undefined} />
                            <AvatarFallback className="text-2xl bg-linear-to-br from-violet-500 to-purple-600 text-white font-medium">
                                {getInitials(post.author.firstName, post.author.lastName, post.author.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Written by</p>
                            <h3 className="text-xl font-bold mb-2">{authorName}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Passionate writer and content creator sharing ideas and insights on The Blog.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Comments Section */}
                <section className="border-t border-border/40 mt-12 pt-12 pb-16">
                    <CommentsWrapper postId={post.id} />
                </section>
            </article>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-muted/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link href="/blog" className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <span className="font-semibold">The Blog</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} The Blog. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
