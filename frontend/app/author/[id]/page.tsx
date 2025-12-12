import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, User as UserIcon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface User {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    bio: string | null
    avatarUrl: string | null
    createdAt: string
}

interface Post {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    publishedAt: string | null
    isPublished: boolean
}

async function getUser(id: string): Promise<User | null> {
    try {
        const res = await fetch(`${API_URL}/users/${id}`, {
            next: { revalidate: 300 }
        })

        if (!res.ok) {
            return null
        }

        return res.json()
    } catch (error) {
        console.error("Failed to fetch user:", error)
        return null
    }
}

async function getUserPosts(id: string): Promise<Post[]> {
    try {
        const res = await fetch(`${API_URL}/users/${id}/posts?published=true`, {
            next: { revalidate: 60 }
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        return data.data || data
    } catch (error) {
        console.error("Failed to fetch user posts:", error)
        return []
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const user = await getUser(id)

    if (!user) {
        return {
            title: "Author Not Found"
        }
    }

    const name = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.email.split("@")[0]

    return {
        title: `${name} - Author Profile`,
        description: user.bio || `Read articles by ${name} on AI Blog Platform`,
    }
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

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [user, posts] = await Promise.all([
        getUser(id),
        getUserPosts(id)
    ])

    if (!user) {
        notFound()
    }

    const authorName = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.email.split("@")[0]

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

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Author Profile Header */}
                <section className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-accent/20">
                            {getInitials(user.firstName, user.lastName, user.email)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                            {authorName}
                        </h1>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <UserIcon className="h-4 w-4" />
                                <span>Author</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{posts.length} articles</span>
                            </div>
                        </div>

                        {user.bio && (
                            <p className="text-muted-foreground max-w-2xl">
                                {user.bio}
                            </p>
                        )}

                        {!user.bio && (
                            <p className="text-muted-foreground italic">
                                This author hasn&apos;t added a bio yet.
                            </p>
                        )}
                    </div>
                </section>

                <Separator className="mb-12" />

                {/* Author's Posts */}
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-8">
                        Articles by {authorName}
                    </h2>

                    {posts.length === 0 && (
                        <div className="text-center py-16 border rounded-lg border-dashed">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No published articles yet</h3>
                            <p className="text-muted-foreground">
                                {authorName} hasn&apos;t published any articles yet. Check back later!
                            </p>
                        </div>
                    )}

                    {posts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/50 hover:border-primary/20">
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                                            {post.coverImage ? (
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <CardHeader className="pb-2">
                                        <Link href={`/blog/${post.slug}`}>
                                            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                        </Link>
                                    </CardHeader>

                                    <CardContent className="pb-2">
                                        {post.excerpt && (
                                            <p className="text-muted-foreground text-sm line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </CardContent>

                                    <CardFooter className="pt-0 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.publishedAt && formatDate(post.publishedAt)}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </main>

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
