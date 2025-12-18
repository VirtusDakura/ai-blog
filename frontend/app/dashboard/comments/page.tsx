/* eslint-disable @typescript-eslint/no-explicit-any -- Session and dynamic data type casting */
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useCommentsModeration, useModerateComment } from "@/hooks/use-cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
    MessageSquare, Check, X, Trash2, Flag, Reply, Search,
    Clock, CheckCircle, AlertCircle, RefreshCw
} from "lucide-react"

export default function CommentsPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const { toast } = useToast()

    // Data Fetching
    const [selectedTab, setSelectedTab] = useState("all")
    // Convert 'all' to undefined for the API to fetch all, or use specific status
    const statusFilter = selectedTab === 'all' ? undefined : selectedTab.toUpperCase()

    const { data: commentsData, isLoading } = useCommentsModeration(userId, statusFilter)
    const moderateComment = useModerateComment()

    const comments = commentsData?.data || []
    const meta = commentsData?.meta || { total: 0, pending: 0, approved: 0, spam: 0 }

    const [searchQuery, setSearchQuery] = useState("")

    const filteredComments = comments.filter((comment: any) => {
        if (searchQuery && !comment.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !comment.authorName?.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    const handleModerate = async (commentId: string, action: 'approve' | 'reject' | 'spam') => {
        if (!userId) return
        try {
            await moderateComment.mutateAsync({ id: commentId, userId, action })
            toast({ title: "Comment updated", description: `Comment marked as ${action}` })
        } catch {
            toast({ title: "Error", description: "Failed to update comment", variant: "destructive" })
        }
    }

    const handleDelete = async (commentId: string) => {
        if (!userId) return
        try {
            // Using 'reject' action to effectively hide/delete the comment
            await moderateComment.mutateAsync({ id: commentId, userId, action: 'reject' })
            toast({ title: "Comment deleted" })
        } catch {
            toast({ title: "Error", description: "Failed to delete comment", variant: "destructive" })
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Approved</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
            case "REJECTED":
                return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Rejected</Badge>
            case "SPAM":
                return <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20">Spam</Badge>
            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
                    <p className="text-muted-foreground">
                        Moderate and manage comments on your posts
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{meta.total}</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-violet-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{meta.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Approved</p>
                                <p className="text-2xl font-bold">{meta.approved}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Spam</p>
                                <p className="text-2xl font-bold">{meta.spam}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search comments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending
                            {meta.pending > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-yellow-500 text-white">
                                    {meta.pending}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="spam">Spam</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Comments List */}
            <Card>
                <CardContent className="p-0">
                    {filteredComments.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No comments found</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredComments.map((comment: any) => (
                                <div key={comment.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={comment.author?.image} />
                                            <AvatarFallback>{(comment.authorName || comment.author?.name || "A").charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{comment.authorName || comment.author?.name || "Anonymous"}</span>
                                                {getStatusBadge(comment.status)}
                                                <span className="text-sm text-muted-foreground">
                                                    on <a href="#" className="text-violet-600 hover:underline">{comment.post?.title || "Unknown Post"}</a>
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {comment.guestEmail || comment.author?.email}
                                            </p>
                                            <p className="text-sm mb-3">{comment.content}</p>
                                            <div className="flex items-center gap-2">
                                                {moderateComment.isPending ? (
                                                    <div className="h-8 flex items-center px-3"><RefreshCw className="h-4 w-4 animate-spin" /></div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        {comment.status === "PENDING" && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleModerate(comment.id, 'approve')}
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                >
                                                                    <Check className="mr-1 h-3 w-3" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleModerate(comment.id, 'reject')}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <X className="mr-1 h-3 w-3" />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button variant="ghost" size="sm">
                                                            <Reply className="mr-1 h-3 w-3" />
                                                            Reply
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleModerate(comment.id, 'spam')}
                                                        >
                                                            <Flag className="mr-1 h-3 w-3" />
                                                            Spam
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(comment.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
