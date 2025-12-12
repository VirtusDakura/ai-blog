"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Image as ImageIcon,
    Upload,
    Search,
    Grid,
    List,
    Trash2,
    Copy,
    Check,
    FolderOpen
} from "lucide-react"

// Sample media items - in production, this would come from Cloudinary API
const sampleMedia = [
    { id: "1", url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643", name: "blog-hero.jpg", size: "2.4 MB", date: "2024-01-15" },
    { id: "2", url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", name: "tech-article.jpg", size: "1.8 MB", date: "2024-01-14" },
    { id: "3", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3", name: "workspace.jpg", size: "3.1 MB", date: "2024-01-13" },
    { id: "4", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f", name: "analytics.jpg", size: "2.0 MB", date: "2024-01-12" },
    { id: "5", url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0", name: "team-meeting.jpg", size: "2.7 MB", date: "2024-01-11" },
    { id: "6", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", name: "collaboration.jpg", size: "1.9 MB", date: "2024-01-10" },
]

export default function MediaPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copyToClipboard = async (url: string, id: string) => {
        await navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredMedia = sampleMedia.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-blue-500" />
                        Media Library
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your images and media files
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Media
                </Button>
            </div>

            {/* Coming Soon Notice */}
            <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/20">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Coming Soon</Badge>
                        <Badge variant="outline">Cloudinary Integration</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Full Cloudinary media management is coming soon. Below is a preview with sample images.
                    </p>
                </CardContent>
            </Card>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search media..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 border rounded-lg p-1">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Media Grid/List */}
            {filteredMedia.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FolderOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No media found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery ? "Try a different search term" : "Upload your first image to get started"}
                        </p>
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Media
                        </Button>
                    </CardContent>
                </Card>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                        <Card key={item.id} className="group overflow-hidden hover:ring-2 ring-primary/50 transition-all">
                            <div className="relative aspect-square">
                                <Image
                                    src={item.url}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0"
                                        onClick={() => copyToClipboard(item.url, item.id)}
                                    >
                                        {copiedId === item.id ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.size}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr className="text-left text-sm text-muted-foreground">
                                    <th className="p-4">Preview</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Size</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedia.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                                        <td className="p-4">
                                            <div className="relative h-12 w-12 rounded overflow-hidden">
                                                <Image
                                                    src={item.url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4 text-muted-foreground">{item.size}</td>
                                        <td className="p-4 text-muted-foreground">{item.date}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => copyToClipboard(item.url, item.id)}
                                                >
                                                    {copiedId === item.id ? (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* Storage Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Storage Usage</CardTitle>
                    <CardDescription>Your Cloudinary storage quota</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>25 MB used of 1 GB</span>
                            <span className="text-muted-foreground">2.5%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: "2.5%" }} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
