"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePosts, useDeletePost, usePublishPost, useUnpublishPost } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    PlusCircle,
    MoreVertical,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    ExternalLink,
    Calendar,
    FileText,
    BookOpen,
    Loader2
} from "lucide-react"

function PostCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardHeader>
        </Card>
    )
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

function getStatusBadge(isPublished: boolean) {
    return isPublished ? (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            <Eye className="h-3 w-3" />
            Published
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <EyeOff className="h-3 w-3" />
            Draft
        </span>
    )
}

export default function PostsListPage() {
    const { data, isLoading, error, refetch } = usePosts({ take: 50 })
    const deletePost = useDeletePost()
    const publishPost = usePublishPost()
    const unpublishPost = useUnpublishPost()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!selectedPostId) return

        try {
            await deletePost.mutateAsync(selectedPostId)
            setDeleteDialogOpen(false)
            setSelectedPostId(null)
        } catch (error) {
            console.error("Failed to delete post:", error)
        }
    }

    const handleTogglePublish = async (postId: string, isPublished: boolean) => {
        try {
            if (isPublished) {
                await unpublishPost.mutateAsync(postId)
            } else {
                await publishPost.mutateAsync(postId)
            }
        } catch (error) {
            console.error("Failed to toggle publish status:", error)
        }
    }

    const openDeleteDialog = (postId: string) => {
        setSelectedPostId(postId)
        setDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your blog posts and drafts
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <p className="text-destructive">Failed to load posts. Please try again.</p>
                        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {data && data.data.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 border rounded-lg border-dashed">
                    <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-6">Get started by creating your first blog post</p>
                    <Button asChild>
                        <Link href="/dashboard/posts/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Your First Post
                        </Link>
                    </Button>
                </div>
            )}

            {/* Posts List */}
            {data && data.data.length > 0 && (
                <div className="space-y-4">
                    {data.data.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start gap-4 p-4">
                                {/* Thumbnail */}
                                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/dashboard/posts/${post.id}/edit`}
                                                className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                                            >
                                                {post.title}
                                            </Link>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                {getStatusBadge(post.isPublished)}
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(post.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/posts/${post.id}/edit`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                {post.isPublished && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            View Post
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleTogglePublish(post.id, post.isPublished)}
                                                    disabled={publishPost.isPending || unpublishPost.isPending}
                                                >
                                                    {post.isPublished ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Publish
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => openDeleteDialog(post.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {post.excerpt && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            {/* Stats */}
            {data && data.data.length > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
                    <span>
                        Showing {data.data.length} of {data.meta.total} posts
                    </span>
                    <span>
                        {data.data.filter(p => p.isPublished).length} published, {data.data.filter(p => !p.isPublished).length} drafts
                    </span>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deletePost.isPending}
                        >
                            {deletePost.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
