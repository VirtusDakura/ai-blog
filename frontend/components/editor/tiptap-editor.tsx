"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import { EditorToolbar } from "./toolbar"
import { useGeneratePost } from "@/hooks/use-api"

interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const generatePost = useGeneratePost()

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
        const url = window.prompt("Enter image URL:")
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const handleAIAutocomplete = async () => {
        if (!editor) return

        const currentText = editor.getText()
        if (!currentText || currentText.length < 10) {
            alert("Please write at least a sentence to continue with AI")
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
        } catch (error) {
            console.error("AI autocomplete failed:", error)
            alert("Failed to generate AI content. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="border rounded-md shadow-sm bg-card text-card-foreground">
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
    )
}
