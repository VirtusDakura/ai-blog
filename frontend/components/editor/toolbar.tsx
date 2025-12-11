"use client"

import { type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import {
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    List,
    ListOrdered,
    Quote,
    Sparkles,
    Strikethrough,
} from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ToolbarProps {
    editor: Editor | null
    onImageUpload?: () => void
    onAIAutocomplete?: () => void
}

export function EditorToolbar({ editor, onImageUpload, onAIAutocomplete }: ToolbarProps) {
    if (!editor) {
        return null
    }

    return (
        <div className="border border-input bg-transparent rounded-t-md p-1 flex items-center gap-1 flex-wrap">
            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Toggle bold"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Toggle italic"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Toggle strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                aria-label="Toggle heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                aria-label="Toggle heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                aria-label="Toggle heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Toggle bullet list"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Toggle ordered list"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                aria-label="Toggle blockquote"
            >
                <Quote className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button variant="ghost" size="sm" onClick={onImageUpload} className="h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Upload Image</span>
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button variant="ghost" size="sm" onClick={onAIAutocomplete} className="h-8 gap-1 px-2 text-purple-500 hover:text-purple-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold">AI</span>
            </Button>
        </div>
    )
}
