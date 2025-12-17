"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { usePages, useCreatePage, useDeletePage, useUpdatePage } from "@/hooks/use-cms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Layout, PlusCircle, Search, Edit2, Trash2, Eye, MoreHorizontal,
    Home, FileText, Mail, User, RefreshCw, GripVertical
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Page templates
const PAGE_TEMPLATES = [
    { id: "default", name: "Default", description: "Standard page layout" },
    { id: "home", name: "Home", description: "Homepage with featured content" },
    { id: "contact", name: "Contact", description: "Contact form page" },
    { id: "legal", name: "Legal", description: "Legal documents layout" },
    { id: "landing", name: "Landing", description: "Full-width landing page" },
]

export default function PagesPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const blogId = (session?.user as any)?.blogId // Assuming context
    const { toast } = useToast()

    const { data: pages = [], isLoading } = usePages(userId)
    const createPage = useCreatePage()
    const deletePage = useDeletePage()
    const updatePage = useUpdatePage()

    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newPage, setNewPage] = useState({ title: "", slug: "", template: "default" })

    const filteredPages = pages.filter((page: any) =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreatePage = async () => {
        if (!userId || !newPage.title) return

        try {
            await createPage.mutateAsync({
                userId,
                title: newPage.title,
                slug: newPage.slug || newPage.title.toLowerCase().replace(/ /g, '-'),
                content: "", // Start empty
                template: newPage.template,
                status: "DRAFT"
            })
            setIsCreateDialogOpen(false)
            setNewPage({ title: "", slug: "", template: "default" })
            toast({ title: "Success", description: "Page created successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to create page", variant: "destructive" })
        }
    }

    const handleDeletePage = async (id: string) => {
        if (!userId) return
        try {
            await deletePage.mutateAsync({ userId, pageId: id })
            toast({ title: "Success", description: "Page deleted" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete page", variant: "destructive" })
        }
    }

    const handleToggleStatus = async (page: any) => {
        if (!userId) return
        const newStatus = page.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
        try {
            await updatePage.mutateAsync({ userId, pageId: page.id, data: { status: newStatus } })
            toast({ title: "Success", description: `Page ${newStatus.toLowerCase()}` })
        } catch (error) {
            toast({ title: "Error", description: "Failed to update page status", variant: "destructive" })
        }
    }

    const getIcon = (template: string) => {
        switch (template) {
            case 'home': return Home;
            case 'contact': return Mail;
            case 'legal': return FileText;
            case 'about': return User; // Logic to infer 'about' if not explicit template
            default: return FileText;
        }
    }

    if (isLoading) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                    <p className="text-muted-foreground">
                        Manage your blog's static pages
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Page
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Page</DialogTitle>
                            <DialogDescription>
                                Add a new static page to your blog
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={newPage.title}
                                    onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. About Us"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (Optional)</Label>
                                <Input
                                    value={newPage.slug}
                                    onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="e.g. about-us"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Template</Label>
                                <Select
                                    value={newPage.template}
                                    onValueChange={(val) => setNewPage(prev => ({ ...prev, template: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAGE_TEMPLATES.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePage} disabled={createPage.isPending}>
                                {createPage.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                Create Page
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Pages List */}
            <Card>
                <CardContent className="p-0">
                    {filteredPages.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No pages found</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredPages.map((page: any) => {
                                const Icon = getIcon(page.template);
                                return (
                                    <div key={page.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-move" />
                                            <div className="p-2 rounded-lg bg-muted">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{page.title}</p>
                                                    {page.isSystem && (
                                                        <Badge variant="outline" className="text-xs">System</Badge>
                                                    )}
                                                    <Badge variant={page.status === "PUBLISHED" ? "default" : "secondary"}>
                                                        {page.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    /{page.slug || "(homepage)"} • {page.template} template
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(page.updatedAt).toLocaleDateString()}
                                            </span>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/${page.slug}`} target="_blank">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(page)}>
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Preview
                                                    </DropdownMenuItem>
                                                    {!page.isSystem && (
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeletePage(page.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Page Templates */}
            <Card>
                <CardHeader>
                    <CardTitle>Page Templates</CardTitle>
                    <CardDescription>
                        Available templates for creating pages
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {PAGE_TEMPLATES.map((template) => (
                            <div
                                key={template.id}
                                className="p-4 rounded-lg border hover:border-violet-500/50 transition-colors cursor-pointer"
                            >
                                <div className="h-20 rounded bg-muted mb-3 flex items-center justify-center">
                                    <Layout className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-muted-foreground">{template.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
