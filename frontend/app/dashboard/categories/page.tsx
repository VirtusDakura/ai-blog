"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useCategories, useCreateCategory, useDeleteCategory, useTags, useCreateTag, useDeleteTag } from "@/hooks/use-cms"
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
import { useToast } from "@/hooks/use-toast"
import {
    Tag, PlusCircle, Trash2, Hash, Folder, RefreshCw
} from "lucide-react"

export default function CategoriesPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const blogId = (session?.user as any)?.blogId // Assuming specific blog context if multi-blog
    const { toast } = useToast()

    // Data fetching
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories(userId)
    const { data: tags = [], isLoading: isLoadingTags } = useTags(userId)

    // Mutations
    const createCategory = useCreateCategory()
    const deleteCategory = useDeleteCategory()
    const createTag = useCreateTag()
    const deleteTag = useDeleteTag()

    const [newCategory, setNewCategory] = useState({ name: "", description: "" })
    const [newTag, setNewTag] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddCategory = async () => {
        if (!newCategory.name || !userId) return

        try {
            await createCategory.mutateAsync({
                userId,
                name: newCategory.name,
                description: newCategory.description,
            })

            setNewCategory({ name: "", description: "" })
            setIsDialogOpen(false)
            toast({ title: "Success", description: "Category created successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to create category", variant: "destructive" })
        }
    }

    const handleAddTag = async () => {
        if (!newTag || !userId) return

        try {
            await createTag.mutateAsync({
                userId,
                name: newTag.toLowerCase(),
            })
            setNewTag("")
            toast({ title: "Success", description: "Tag created successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to create tag", variant: "destructive" })
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!userId) return
        try {
            await deleteCategory.mutateAsync({ userId, categoryId: id })
            toast({ title: "Success", description: "Category deleted" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete category", variant: "destructive" })
        }
    }

    const handleDeleteTag = async (id: string) => {
        if (!userId) return
        try {
            await deleteTag.mutateAsync({ userId, tagId: id })
            toast({ title: "Success", description: "Tag deleted" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete tag", variant: "destructive" })
        }
    }

    if (isLoadingCategories || isLoadingTags) {
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
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddCategory} disabled={createCategory.isPending}>
                                            {createCategory.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
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
                                {categories.map((category: any) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                <p className="text-sm text-muted-foreground">{category.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{category._count?.posts || 0} posts</Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                                onClick={() => handleDeleteCategory(category.id)}
                                                disabled={deleteCategory.isPending}
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
                            <Button onClick={handleAddTag} disabled={createTag.isPending}>
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
                                {tags.map((tag: any) => (
                                    <Badge
                                        key={tag.id}
                                        variant="secondary"
                                        className="px-3 py-1.5 text-sm group cursor-pointer hover:bg-secondary/80"
                                    >
                                        <Hash className="h-3 w-3 mr-1" />
                                        {tag.name}
                                        <span className="ml-2 text-muted-foreground">({tag._count?.posts || 0})</span>
                                        <button
                                            onClick={() => handleDeleteTag(tag.id)}
                                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            disabled={deleteTag.isPending}
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
