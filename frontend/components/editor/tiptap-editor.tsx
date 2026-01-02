"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import { EditorToolbar } from "./toolbar"
import { useGeneratePost } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [showImageDialog, setShowImageDialog] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const generatePost = useGeneratePost()
    const { toast } = useToast()

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Write something amazing...",
            }),
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px]",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const handleImageUpload = () => {
        setShowImageDialog(true)
    }

    const handleInsertImage = () => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setShowImageDialog(false)
            setImageUrl("")
            toast({ title: "Image added", description: "Image has been inserted into the editor", variant: "success" })
        }
    }

    const handleAIAutocomplete = async () => {
        if (!editor) return

        const currentText = editor.getText()
        if (!currentText || currentText.length < 10) {
            toast({ title: "More content needed", description: "Please write at least a sentence to continue with AI", variant: "warning" })
            return
        }

        setIsGenerating(true)

        try {
            // Generate continuation based on current content
            const result = await generatePost.mutateAsync({
                topic: `Continue this text naturally and coherently: "${currentText.slice(-200)}"`,
                outline: "Write 2-3 sentences that naturally continue the existing text. Do not repeat what's already written. Just provide the continuation without any prefixes or labels."
            })

            // Extract just the continuation part and append
            const continuation = result.content
                .replace(/^(Continuation:|Continue:|Here's the continuation:|Here is|The continuation is:)/i, '')
                .trim()

            editor.chain().focus().insertContent(" " + continuation).run()
            toast({ title: "AI content added", description: "AI has continued your text", variant: "success" })
        } catch (error) {
            console.error("AI autocomplete failed:", error)
            toast({ title: "AI failed", description: "Failed to generate AI content. Please try again.", variant: "error" })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <>
            <div className="border rounded-lg shadow-sm bg-card text-card-foreground">
                <EditorToolbar
                    editor={editor}
                    onImageUpload={handleImageUpload}
                    onAIAutocomplete={handleAIAutocomplete}
                    isGenerating={isGenerating}
                />
                <div className="p-4">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Image URL Dialog */}
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleInsertImage} disabled={!imageUrl}>
                            Insert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
