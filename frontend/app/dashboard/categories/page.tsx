"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tag, PlusCircle, Edit2, Trash2, Hash, Folder, GripVertical
} from "lucide-react"

// Mock categories data
const mockCategories = [
    { id: 1, name: "Technology", slug: "technology", description: "Tech news and tutorials", postCount: 12, color: "#3b82f6" },
    { id: 2, name: "Lifestyle", slug: "lifestyle", description: "Daily life tips and stories", postCount: 8, color: "#ec4899" },
    { id: 3, name: "Business", slug: "business", description: "Business and entrepreneurship", postCount: 5, color: "#f59e0b" },
    { id: 4, name: "Travel", slug: "travel", description: "Travel guides and experiences", postCount: 3, color: "#10b981" },
]

// Mock tags data
const mockTags = [
    { id: 1, name: "javascript", postCount: 15 },
    { id: 2, name: "react", postCount: 12 },
    { id: 3, name: "nextjs", postCount: 8 },
    { id: 4, name: "typescript", postCount: 7 },
    { id: 5, name: "css", postCount: 6 },
    { id: 6, name: "tailwindcss", postCount: 5 },
    { id: 7, name: "nodejs", postCount: 4 },
    { id: 8, name: "ai", postCount: 3 },
]

export default function CategoriesPage() {
    const [categories, setCategories] = useState(mockCategories)
    const [tags, setTags] = useState(mockTags)
    const [newCategory, setNewCategory] = useState({ name: "", description: "", color: "#8b5cf6" })
    const [newTag, setNewTag] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddCategory = () => {
        if (!newCategory.name) return
        const slug = newCategory.name.toLowerCase().replace(/\s+/g, "-")
        setCategories(prev => [...prev, {
            id: Date.now(),
            name: newCategory.name,
            slug,
            description: newCategory.description,
            postCount: 0,
            color: newCategory.color,
        }])
        setNewCategory({ name: "", description: "", color: "#8b5cf6" })
        setIsDialogOpen(false)
    }

    const handleAddTag = () => {
        if (!newTag) return
        setTags(prev => [...prev, { id: Date.now(), name: newTag.toLowerCase(), postCount: 0 }])
        setNewTag("")
    }

    const handleDeleteCategory = (id: number) => {
        setCategories(prev => prev.filter(c => c.id !== id))
    }

    const handleDeleteTag = (id: number) => {
        setTags(prev => prev.filter(t => t.id !== id))
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories & Tags</h1>
                    <p className="text-muted-foreground">
                        Organize your content with categories and tags
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Categories Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Folder className="h-5 w-5" />
                                    Categories
                                </CardTitle>
                                <CardDescription>
                                    Main content categories
                                </CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Category</DialogTitle>
                                        <DialogDescription>
                                            Create a new category to organize your posts
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="categoryName">Category Name</Label>
                                            <Input
                                                id="categoryName"
                                                value={newCategory.name}
                                                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="e.g., Technology"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="categoryDescription">Description</Label>
                                            <Textarea
                                                id="categoryDescription"
                                                value={newCategory.description}
                                                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Brief description of this category..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="categoryColor">Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    id="categoryColor"
                                                    value={newCategory.color}
                                                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                                                    className="w-12 h-10 p-1"
                                                />
                                                <Input
                                                    value={newCategory.color}
                                                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                                                    className="font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddCategory}>
                                            Create Category
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {categories.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No categories yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-move" />
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                <p className="text-sm text-muted-foreground">{category.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{category.postCount} posts</Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tags Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Hash className="h-5 w-5" />
                                    Tags
                                </CardTitle>
                                <CardDescription>
                                    Fine-grained content labels
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Add Tag Input */}
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add new tag..."
                                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                            />
                            <Button onClick={handleAddTag}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add
                            </Button>
                        </div>

                        {/* Tags Cloud */}
                        {tags.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No tags yet</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant="secondary"
                                        className="px-3 py-1.5 text-sm group cursor-pointer hover:bg-secondary/80"
                                    >
                                        <Hash className="h-3 w-3 mr-1" />
                                        {tag.name}
                                        <span className="ml-2 text-muted-foreground">({tag.postCount})</span>
                                        <button
                                            onClick={() => handleDeleteTag(tag.id)}
                                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
