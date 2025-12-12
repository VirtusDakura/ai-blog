"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useComments, useCreateComment, useDeleteComment, Comment } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Loader2, Trash2, Reply, LogIn } from "lucide-react"

interface CommentsProps {
    postId: string
}

function getInitials(firstName?: string | null, lastName?: string | null) {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (firstName) {
        return firstName[0].toUpperCase()
    }
    return "U"
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

function CommentItem({
    comment,
    postId,
    onReply,
    currentUserId
}: {
    comment: Comment
    postId: string
    onReply: (parentId: string) => void
    currentUserId?: string
}) {
    const deleteComment = useDeleteComment()
    const authorName = comment.author.firstName
        ? `${comment.author.firstName} ${comment.author.lastName || ""}`.trim()
        : "Anonymous"

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this comment?")) return

        try {
            await deleteComment.mutateAsync({ id: comment.id, postId })
        } catch (error) {
            console.error("Failed to delete comment:", error)
        }
    }

    return (
        <div className="group">
            <div className="flex gap-3">
                <Avatar className="h-9 w-9 mt-1">
                    <AvatarImage src={comment.author.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs">
                        {getInitials(comment.author.firstName, comment.author.lastName)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{authorName}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>

                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onReply(comment.id)}
                        >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                        </Button>
                        {currentUserId === comment.authorId && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={handleDelete}
                                disabled={deleteComment.isPending}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                            </Button>
                        )}
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-muted">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    postId={postId}
                                    onReply={onReply}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function CommentsSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function CommentsSection({ postId }: CommentsProps) {
    const { data: session } = useSession()
    const { data, isLoading, error } = useComments(postId)
    const createComment = useCreateComment()

    const [content, setContent] = useState("")
    const [replyTo, setReplyTo] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) return

        try {
            await createComment.mutateAsync({
                content: content.trim(),
                postId,
                parentId: replyTo || undefined,
            })
            setContent("")
            setReplyTo(null)
        } catch (error) {
            console.error("Failed to create comment:", error)
        }
    }

    const handleReply = (parentId: string) => {
        setReplyTo(parentId)
        // Focus the textarea
        const textarea = document.getElementById("comment-input")
        textarea?.focus()
    }

    const cancelReply = () => {
        setReplyTo(null)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments
                    {data && (
                        <span className="text-sm font-normal text-muted-foreground">
                            ({data.meta.total})
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Comment Form */}
                {session ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {replyTo && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                                <Reply className="h-4 w-4" />
                                <span>Replying to a comment</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto h-6"
                                    onClick={cancelReply}
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={session.user?.image || undefined} />
                                <AvatarFallback>
                                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    id="comment-input"
                                    placeholder="Write a comment..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!content.trim() || createComment.isPending}
                                        size="sm"
                                    >
                                        {createComment.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Post Comment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
                        <LogIn className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="font-medium">Sign in to comment</p>
                            <p className="text-sm text-muted-foreground">
                                Join the conversation by logging in
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>
                )}

                {/* Comments List */}
                {isLoading ? (
                    <CommentsSkeleton />
                ) : error ? (
                    <p className="text-sm text-destructive">Failed to load comments</p>
                ) : data?.data.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">No comments yet</p>
                        <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {data?.data.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                onReply={handleReply}
                                currentUserId={undefined}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
