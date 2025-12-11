"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import ImageUpload from "@/components/ui/image-upload"
import { ArrowLeft, Wand2, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useAI, useCreatePost, usePublishPost } from "@/hooks/use-api"

export default function NewPostPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [content, setContent] = useState("")

    // API hooks
    const { generateArticle } = useAI()
    const createPost = useCreatePost()
    const publishPost = usePublishPost()

    const isGenerating = generateArticle.isPending
    const isSaving = createPost.isPending || publishPost.isPending

    const handleGenerate = async () => {
        if (!title) {
            alert("Please enter a title first")
            return
        }

        try {
            const data = await generateArticle.mutateAsync({ topic: title })
            setContent(data.content)
        } catch (error) {
            console.error(error)
            alert("Failed to generate content. Please try again.")
        }
    }

    const handleSaveDraft = async () => {
        if (!title) {
            alert("Please enter a title")
            return
        }

        try {
            await createPost.mutateAsync({
                title,
                content,
                coverImage: coverImage || undefined,
            })
            alert("Draft saved successfully!")
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            alert("Failed to save draft. Please try again.")
        }
    }

    const handlePublish = async () => {
        if (!title) {
            alert("Please enter a title")
            return
        }

        try {
            const post = await createPost.mutateAsync({
                title,
                content,
                coverImage: coverImage || undefined,
            })
            await publishPost.mutateAsync(post.id)
            alert("Post published successfully!")
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
            alert("Failed to publish. Please try again.")
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold tracking-tight">Create New Post</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Draft
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={isSaving}
                    >
                        {isSaving ? "Publishing..." : "Publish"}
                    </Button>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <Input
                    placeholder="Post Title"
                    className="text-lg font-bold h-12"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={handleGenerate}
                        disabled={isGenerating || !title}
                        type="button"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Auto-Generate Content
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
        </div>
    )
}
