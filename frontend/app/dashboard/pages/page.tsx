"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Layout, PlusCircle, Search, Edit2, Trash2, Eye, MoreHorizontal,
    Home, FileText, Mail, User, Settings, ExternalLink, GripVertical
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock pages data
const mockPages = [
    {
        id: 1,
        title: "Home",
        slug: "",
        status: "published",
        template: "home",
        icon: Home,
        isSystem: true,
        updatedAt: "2024-12-17"
    },
    {
        id: 2,
        title: "About",
        slug: "about",
        status: "published",
        template: "default",
        icon: User,
        isSystem: false,
        updatedAt: "2024-12-15"
    },
    {
        id: 3,
        title: "Contact",
        slug: "contact",
        status: "published",
        template: "contact",
        icon: Mail,
        isSystem: false,
        updatedAt: "2024-12-14"
    },
    {
        id: 4,
        title: "Privacy Policy",
        slug: "privacy",
        status: "published",
        template: "legal",
        icon: FileText,
        isSystem: false,
        updatedAt: "2024-12-10"
    },
    {
        id: 5,
        title: "Terms of Service",
        slug: "terms",
        status: "draft",
        template: "legal",
        icon: FileText,
        isSystem: false,
        updatedAt: "2024-12-08"
    },
]

// Page templates
const pageTemplates = [
    { id: "default", name: "Default", description: "Standard page layout" },
    { id: "home", name: "Home", description: "Homepage with featured content" },
    { id: "contact", name: "Contact", description: "Contact form page" },
    { id: "legal", name: "Legal", description: "Legal documents layout" },
    { id: "landing", name: "Landing", description: "Full-width landing page" },
]

export default function PagesPage() {
    const [pages, setPages] = useState(mockPages)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDeletePage = (id: number) => {
        setPages(prev => prev.filter(p => p.id !== id))
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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Page
                </Button>
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
                            {filteredPages.map((page) => {
                                const Icon = page.icon
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
                                                    <Badge variant={page.status === "published" ? "default" : "secondary"}>
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
                                                    <DropdownMenuItem>
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        Edit
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
                        {pageTemplates.map((template) => (
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
