"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPostPage() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSave = () => {
        setIsSubmitting(true)
        console.log("Saving post:", { title, content })
        setTimeout(() => {
            setIsSubmitting(false)
            alert("Post saved (mock)!")
        }, 1000)
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
                    <Button variant="outline">Discard</Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Publish"}
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
                <TiptapEditor content={content} onChange={setContent} />
            </div>
        </div>
    )
}
