"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePost, useUpdatePost, usePublishPost, useUnpublishPost, useGenerateSeo, useAI } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import ImageUpload from "@/components/ui/image-upload"
import {
    ArrowLeft,
    Save,
    Loader2,
    Eye,
    EyeOff,
    Sparkles,
    ExternalLink,
    Wand2,
    Settings,
    AlertTriangle
} from "lucide-react"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { toast } = useToast()

    // Fetch post data
    const { data: post, isLoading, error } = usePost(id)

    // Mutations
    const updatePost = useUpdatePost()
    const publishPost = usePublishPost()
    const unpublishPost = useUnpublishPost()
    const generateSeo = useGenerateSeo()
    const { generateArticle } = useAI()

    // Local state
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [seoTitle, setSeoTitle] = useState("")
    const [seoDescription, setSeoDescription] = useState("")
    const [seoKeywords, setSeoKeywords] = useState<string[]>([])
    const [showSeoPanel, setShowSeoPanel] = useState(false)
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)

    // Initialize form with post data
    useEffect(() => {
        if (post) {
            setTitle(post.title || "")
            setContent(post.content || "")
            setExcerpt(post.excerpt || "")
            setCoverImage(post.coverImage || "")
            setSeoTitle(post.seoTitle || "")
            setSeoDescription(post.seoDescription || "")
            setSeoKeywords(post.seoKeywords || [])
        }
    }, [post])

    const isSaving = updatePost.isPending
    const isPublishing = publishPost.isPending || unpublishPost.isPending
    const isGeneratingSeo = generateSeo.isPending
    const isRegenerating = generateArticle.isPending

    const handleSave = async () => {
        if (!title) {
            toast({ title: "Title required", description: "Please enter a title", variant: "warning" })
            return
        }

        try {
            await updatePost.mutateAsync({
                id,
                data: {
                    title,
                    content,
                    excerpt,
                    coverImage: coverImage || undefined,
                    seoTitle,
                    seoDescription,
                    seoKeywords,
                }
            })
            toast({ title: "Saved!", description: "Post saved successfully!", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Save failed", description: "Failed to save post. Please try again.", variant: "error" })
        }
    }

    const handlePublish = async () => {
        try {
            // Save first
            await updatePost.mutateAsync({
                id,
                data: { title, content, excerpt, coverImage }
            })

            if (post?.isPublished) {
                await unpublishPost.mutateAsync(id)
                toast({ title: "Unpublished", description: "Post has been unpublished", variant: "success" })
            } else {
                await publishPost.mutateAsync(id)
                toast({ title: "Published!", description: "Post published successfully!", variant: "success" })
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Action failed", description: "Failed to update publish status. Please try again.", variant: "error" })
        }
    }

    const handleGenerateSeo = async () => {
        if (!content) {
            toast({ title: "Content required", description: "Please add some content first", variant: "warning" })
            return
        }

        try {
            const seoData = await generateSeo.mutateAsync(content)
            setSeoTitle(seoData.title)
            setSeoDescription(seoData.description)
            setSeoKeywords(seoData.keywords)
            toast({ title: "SEO generated", description: "SEO metadata has been generated", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Generation failed", description: "Failed to generate SEO metadata. Please try again.", variant: "error" })
        }
    }

    const handleRegenerateContent = async () => {
        if (!title) {
            toast({ title: "Title required", description: "Please enter a title first", variant: "warning" })
            return
        }

        setShowRegenerateDialog(false)

        try {
            const data = await generateArticle.mutateAsync({ topic: title })
            setContent(data.content)
            toast({ title: "Regenerated!", description: "Content has been regenerated with AI", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Regeneration failed", description: "Failed to regenerate content. Please try again.", variant: "error" })
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been deleted.</p>
                <Button asChild>
                    <Link href="/dashboard/posts">Back to Posts</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/posts">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold tracking-tight">Edit Post</h2>
                    <p className="text-sm text-muted-foreground">
                        {post.isPublished ? (
                            <span className="text-green-600 dark:text-green-400">Published</span>
                        ) : (
                            <span className="text-amber-600 dark:text-amber-400">Draft</span>
                        )}
                        {" · "}
                        Last updated {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowSeoPanel(!showSeoPanel)}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        SEO
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        variant={post.isPublished ? "outline" : "default"}
                    >
                        {isPublishing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : post.isPublished ? (
                            <EyeOff className="mr-2 h-4 w-4" />
                        ) : (
                            <Eye className="mr-2 h-4 w-4" />
                        )}
                        {post.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    {post.isPublished && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            <Separator />

            {/* Regenerate Confirmation Dialog */}
            <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Regenerate Content
                        </DialogTitle>
                        <DialogDescription>
                            This will replace all existing content with AI-generated content based on your title. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRegenerateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRegenerateContent} disabled={isRegenerating}>
                            {isRegenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Regenerating...
                                </>
                            ) : (
                                "Regenerate"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Editor */}
                <div className={`space-y-4 ${showSeoPanel ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <Input
                        placeholder="Post Title"
                        className="text-lg font-bold h-12"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Textarea
                        placeholder="Short excerpt or summary (optional)"
                        className="resize-none"
                        rows={2}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setShowRegenerateDialog(true)}
                            disabled={isRegenerating || !title}
                            size="sm"
                        >
                            {isRegenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Regenerating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Regenerate with AI
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Cover Image</p>
                        <ImageUpload
                            value={coverImage ? [coverImage] : []}
                            onChange={(url) => setCoverImage(url)}
                            onRemove={() => setCoverImage("")}
                        />
                    </div>

                    <TiptapEditor content={content} onChange={setContent} />
                </div>

                {/* SEO Panel */}
                {showSeoPanel && (
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">SEO Settings</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleGenerateSeo}
                                        disabled={isGeneratingSeo || !content}
                                    >
                                        {isGeneratingSeo ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">SEO Title</label>
                                    <Input
                                        placeholder="SEO-optimized title"
                                        value={seoTitle}
                                        onChange={(e) => setSeoTitle(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {seoTitle.length}/60 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Meta Description</label>
                                    <Textarea
                                        placeholder="Brief description for search engines"
                                        rows={3}
                                        value={seoDescription}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {seoDescription.length}/160 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Keywords</label>
                                    <Input
                                        placeholder="Comma-separated keywords"
                                        value={seoKeywords.join(", ")}
                                        onChange={(e) => setSeoKeywords(e.target.value.split(",").map(k => k.trim()).filter(Boolean))}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Search Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-lg border bg-background">
                                    <p className="text-blue-600 dark:text-blue-400 text-lg font-medium line-clamp-1">
                                        {seoTitle || title || "Page Title"}
                                    </p>
                                    <p className="text-green-600 dark:text-green-400 text-sm">
                                        yourblog.com/blog/{post.slug}
                                    </p>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                                        {seoDescription || excerpt || "Add a meta description to improve your search visibility."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
