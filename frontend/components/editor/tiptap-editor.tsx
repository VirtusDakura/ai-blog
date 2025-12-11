"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import { EditorToolbar } from "./toolbar"

interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
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
        const url = window.prompt("Enter image URL (Cloudinary upload stub):")
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const handleAIAutocomplete = () => {
        if (editor) {
            const currentText = editor.getText();
            // Mock AI completion
            const completion = " [AI Generated Text: This is a simulated completion based on your context.] "
            editor.chain().focus().insertContent(completion).run()
        }
    }

    return (
        <div className="border rounded-md shadow-sm bg-card text-card-foreground">
            <EditorToolbar
                editor={editor}
                onImageUpload={handleImageUpload}
                onAIAutocomplete={handleAIAutocomplete}
            />
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
