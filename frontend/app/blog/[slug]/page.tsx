import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, Clock, ArrowLeft, Share2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
    return "U"
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
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                    <Link href="/blog" className="flex items-center gap-2 font-bold text-xl">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span>AI Blog</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            All Articles
                        </Link>
                        <Button asChild size="sm">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <article className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Navigation */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Articles
                </Link>

                {/* Article Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground mb-6">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <Link
                            href={`/author/${post.author.id}`}
                            className="flex items-center gap-2 hover:text-foreground transition-colors"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={post.author.avatarUrl || undefined} />
                                <AvatarFallback>
                                    {getInitials(post.author.firstName, post.author.lastName, post.author.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-foreground">{authorName}</p>
                                <p className="text-xs">Author</p>
                            </div>
                        </Link>

                        <Separator orientation="vertical" className="h-8" />

                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{post.publishedAt && formatDate(post.publishedAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{getReadingTime(post.content)}</span>
                        </div>

                        <Button variant="ghost" size="sm" className="ml-auto">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </header>

                {/* Cover Image */}
                {post.coverImage && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-10 shadow-lg">
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
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Separator className="my-12" />

                {/* Author Bio */}
                <section className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-xl bg-muted/50">
                    <Link href={`/author/${post.author.id}`}>
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={post.author.avatarUrl || undefined} />
                            <AvatarFallback className="text-2xl">
                                {getInitials(post.author.firstName, post.author.lastName, post.author.email)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Written by</p>
                        <Link href={`/author/${post.author.id}`}>
                            <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                {authorName}
                            </h3>
                        </Link>
                        <p className="text-muted-foreground mt-2">
                            Passionate writer and content creator on AI Blog Platform.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4" asChild>
                            <Link href={`/author/${post.author.id}`}>
                                <User className="h-4 w-4 mr-2" />
                                View Profile
                            </Link>
                        </Button>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Comments Section */}
                <CommentsWrapper postId={post.id} />
            </article>

            {/* Footer */}
            <footer className="border-t bg-muted/30 mt-12">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="font-semibold">AI Blog Platform</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} AI Blog Platform. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
