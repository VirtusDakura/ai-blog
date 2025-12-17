"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    MessageSquare, Check, X, Trash2, Flag, Reply, Search, Filter,
    Clock, CheckCircle2, AlertCircle, MoreHorizontal
} from "lucide-react"

// Mock comments data
const mockComments = [
    {
        id: 1,
        author: "John Doe",
        email: "john@example.com",
        avatar: "",
        content: "Great article! Really helped me understand the topic better.",
        postTitle: "Getting Started with AI",
        postSlug: "getting-started-with-ai",
        createdAt: "2024-12-17T10:30:00Z",
        status: "pending",
    },
    {
        id: 2,
        author: "Jane Smith",
        email: "jane@example.com",
        avatar: "",
        content: "I have a question about the second point. Could you elaborate?",
        postTitle: "10 Tips for Better Writing",
        postSlug: "10-tips-for-better-writing",
        createdAt: "2024-12-16T15:45:00Z",
        status: "approved",
    },
    {
        id: 3,
        author: "SpamBot",
        email: "spam@fake.com",
        avatar: "",
        content: "Buy cheap products at our website! Click here for deals!",
        postTitle: "Getting Started with AI",
        postSlug: "getting-started-with-ai",
        createdAt: "2024-12-15T08:20:00Z",
        status: "spam",
    },
]

export default function CommentsPage() {
    const [comments, setComments] = useState(mockComments)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTab, setSelectedTab] = useState("all")

    const filteredComments = comments.filter(comment => {
        if (selectedTab !== "all" && comment.status !== selectedTab) return false
        if (searchQuery && !comment.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !comment.author.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    const handleApprove = (id: number) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status: "approved" } : c))
    }

    const handleReject = (id: number) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" } : c))
    }

    const handleSpam = (id: number) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status: "spam" } : c))
    }

    const handleDelete = (id: number) => {
        setComments(prev => prev.filter(c => c.id !== id))
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Approved</Badge>
            case "pending":
                return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
            case "rejected":
                return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Rejected</Badge>
            case "spam":
                return <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/20">Spam</Badge>
            default:
                return null
        }
    }

    const pendingCount = comments.filter(c => c.status === "pending").length
    const approvedCount = comments.filter(c => c.status === "approved").length
    const spamCount = comments.filter(c => c.status === "spam").length

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
                                <p className="text-2xl font-bold">{comments.length}</p>
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
                                <p className="text-2xl font-bold">{pendingCount}</p>
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
                                <p className="text-2xl font-bold">{approvedCount}</p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Spam</p>
                                <p className="text-2xl font-bold">{spamCount}</p>
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
                            {pendingCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-yellow-500 text-white">
                                    {pendingCount}
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
                            {filteredComments.map((comment) => (
                                <div key={comment.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={comment.avatar} />
                                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{comment.author}</span>
                                                {getStatusBadge(comment.status)}
                                                <span className="text-sm text-muted-foreground">
                                                    on <a href="#" className="text-violet-600 hover:underline">{comment.postTitle}</a>
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {comment.email}
                                            </p>
                                            <p className="text-sm mb-3">{comment.content}</p>
                                            <div className="flex items-center gap-2">
                                                {comment.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleApprove(comment.id)}
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            <Check className="mr-1 h-3 w-3" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReject(comment.id)}
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
                                                    onClick={() => handleSpam(comment.id)}
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
