"use client"

import { useState } from "react"
import { useBlog } from "@/contexts/blog-context"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Palette, Layout, Type, Image, Moon, Sun, Monitor, Check, Save, RefreshCw,
    Paintbrush, Layers, Eye
} from "lucide-react"

// Theme options
const THEMES = [
    {
        id: "minimal",
        name: "Minimal",
        description: "Clean and simple design",
        preview: "bg-white dark:bg-zinc-900",
        colors: ["#ffffff", "#f4f4f5", "#18181b"]
    },
    {
        id: "modern",
        name: "Modern",
        description: "Contemporary with subtle gradients",
        preview: "bg-gradient-to-br from-slate-50 to-slate-100",
        colors: ["#f8fafc", "#e2e8f0", "#1e293b"]
    },
    {
        id: "bold",
        name: "Bold",
        description: "Vibrant colors and strong contrast",
        preview: "bg-gradient-to-br from-violet-600 to-purple-700",
        colors: ["#7c3aed", "#a855f7", "#ffffff"]
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Sophisticated with warm tones",
        preview: "bg-gradient-to-br from-amber-50 to-orange-50",
        colors: ["#fffbeb", "#fed7aa", "#78350f"]
    },
    {
        id: "dark",
        name: "Dark",
        description: "Dark mode by default",
        preview: "bg-gradient-to-br from-zinc-900 to-black",
        colors: ["#18181b", "#27272a", "#fafafa"]
    },
    {
        id: "newspaper",
        name: "Newspaper",
        description: "Classic editorial style",
        preview: "bg-stone-50",
        colors: ["#fafaf9", "#d6d3d1", "#1c1917"]
    },
]

// Color schemes
const COLOR_SCHEMES = [
    { id: "violet", color: "#8b5cf6", name: "Violet" },
    { id: "blue", color: "#3b82f6", name: "Blue" },
    { id: "emerald", color: "#10b981", name: "Emerald" },
    { id: "rose", color: "#f43f5e", name: "Rose" },
    { id: "amber", color: "#f59e0b", name: "Amber" },
    { id: "cyan", color: "#06b6d4", name: "Cyan" },
    { id: "pink", color: "#ec4899", name: "Pink" },
    { id: "indigo", color: "#6366f1", name: "Indigo" },
]

// Font options
const FONTS = [
    { id: "inter", name: "Inter", preview: "font-sans" },
    { id: "georgia", name: "Georgia", preview: "font-serif" },
    { id: "mono", name: "Mono", preview: "font-mono" },
    { id: "system", name: "System", preview: "font-sans" },
]

// Layout options
const LAYOUTS = [
    { id: "standard", name: "Standard", description: "Centered content with sidebar" },
    { id: "wide", name: "Wide", description: "Full-width content layout" },
    { id: "magazine", name: "Magazine", description: "Grid-based magazine style" },
    { id: "minimal", name: "Minimal", description: "Single column, focused reading" },
]

export default function AppearancePage() {
    const { data: session } = useSession()
    const blog = useBlog()
    const [isLoading, setIsLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const [appearance, setAppearance] = useState({
        theme: blog.theme || "minimal",
        colorScheme: blog.colorScheme || "violet",
        font: "inter",
        layout: "standard",
        darkMode: "system",
        customCss: "",
        logoUrl: "",
        faviconUrl: "",
        headerCode: "",
        footerCode: "",
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            const userId = (session?.user as any)?.id

            const res = await fetch(`${API_URL}/blog/setup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    blogName: blog.blogName,
                    subdomain: blog.subdomain,
                    theme: appearance.theme,
                    colorScheme: appearance.colorScheme,
                }),
            })

            if (res.ok) {
                setSaveSuccess(true)
                blog.refetch()
                setTimeout(() => setSaveSuccess(false), 3000)
            }
        } catch (error) {
            console.error("Failed to save appearance:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
                    <p className="text-muted-foreground">
                        Customize how your blog looks
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {saveSuccess && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Saved!</span>
                        </div>
                    )}
                    <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="theme" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="theme" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Theme
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="gap-2">
                        <Paintbrush className="h-4 w-4" />
                        Colors
                    </TabsTrigger>
                    <TabsTrigger value="typography" className="gap-2">
                        <Type className="h-4 w-4" />
                        Typography
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="gap-2">
                        <Layout className="h-4 w-4" />
                        Layout
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="gap-2">
                        <Image className="h-4 w-4" />
                        Branding
                    </TabsTrigger>
                </TabsList>

                {/* Theme Selection */}
                <TabsContent value="theme" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Theme</CardTitle>
                            <CardDescription>
                                Select a pre-designed theme for your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setAppearance(prev => ({ ...prev, theme: theme.id }))}
                                        className={`
                                            relative p-4 rounded-xl border-2 text-left transition-all
                                            ${appearance.theme === theme.id
                                                ? "border-violet-500 ring-2 ring-violet-500/20"
                                                : "border-border hover:border-violet-500/50"
                                            }
                                        `}
                                    >
                                        {appearance.theme === theme.id && (
                                            <div className="absolute top-2 right-2 p-1 rounded-full bg-violet-500 text-white">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                        <div className={`h-24 rounded-lg mb-3 ${theme.preview}`} />
                                        <h4 className="font-semibold">{theme.name}</h4>
                                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                                        <div className="flex gap-1 mt-2">
                                            {theme.colors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dark Mode</CardTitle>
                            <CardDescription>
                                Choose how dark mode is handled
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {[
                                    { id: "light", label: "Light", icon: Sun },
                                    { id: "dark", label: "Dark", icon: Moon },
                                    { id: "system", label: "System", icon: Monitor },
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setAppearance(prev => ({ ...prev, darkMode: mode.id }))}
                                        className={`
                                            flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                                            ${appearance.darkMode === mode.id
                                                ? "border-violet-500 bg-violet-500/5"
                                                : "border-border hover:border-violet-500/50"
                                            }
                                        `}
                                    >
                                        <mode.icon className="h-6 w-6" />
                                        <span className="font-medium">{mode.label}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Colors */}
                <TabsContent value="colors" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Accent Color</CardTitle>
                            <CardDescription>
                                Choose your blog's primary accent color
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {COLOR_SCHEMES.map((scheme) => (
                                    <button
                                        key={scheme.id}
                                        onClick={() => setAppearance(prev => ({ ...prev, colorScheme: scheme.id }))}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                                            ${appearance.colorScheme === scheme.id
                                                ? "border-current ring-2 ring-current/20"
                                                : "border-transparent hover:border-current/30"
                                            }
                                        `}
                                        style={{ borderColor: appearance.colorScheme === scheme.id ? scheme.color : undefined }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full"
                                            style={{ backgroundColor: scheme.color }}
                                        />
                                        <span className="font-medium">{scheme.name}</span>
                                        {appearance.colorScheme === scheme.id && (
                                            <Check className="h-4 w-4" style={{ color: scheme.color }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Colors</CardTitle>
                            <CardDescription>
                                Fine-tune your color palette
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" className="w-12 h-10 p-1" defaultValue="#8b5cf6" />
                                        <Input defaultValue="#8b5cf6" className="font-mono" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" className="w-12 h-10 p-1" defaultValue="#a855f7" />
                                        <Input defaultValue="#a855f7" className="font-mono" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" className="w-12 h-10 p-1" defaultValue="#ffffff" />
                                        <Input defaultValue="#ffffff" className="font-mono" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Typography */}
                <TabsContent value="typography" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Font Family</CardTitle>
                            <CardDescription>
                                Choose fonts for your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {FONTS.map((font) => (
                                <button
                                    key={font.id}
                                    onClick={() => setAppearance(prev => ({ ...prev, font: font.id }))}
                                    className={`
                                        w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all
                                        ${appearance.font === font.id
                                            ? "border-violet-500"
                                            : "border-border hover:border-violet-500/50"
                                        }
                                    `}
                                >
                                    <div>
                                        <p className={`text-lg font-semibold ${font.preview}`}>{font.name}</p>
                                        <p className={`text-sm text-muted-foreground ${font.preview}`}>
                                            The quick brown fox jumps over the lazy dog.
                                        </p>
                                    </div>
                                    {appearance.font === font.id && (
                                        <Check className="h-5 w-5 text-violet-500" />
                                    )}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Layout */}
                <TabsContent value="layout" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Layout</CardTitle>
                            <CardDescription>
                                Choose how your blog content is displayed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {LAYOUTS.map((layout) => (
                                    <button
                                        key={layout.id}
                                        onClick={() => setAppearance(prev => ({ ...prev, layout: layout.id }))}
                                        className={`
                                            p-4 rounded-xl border-2 text-left transition-all
                                            ${appearance.layout === layout.id
                                                ? "border-violet-500"
                                                : "border-border hover:border-violet-500/50"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold">{layout.name}</h4>
                                            {appearance.layout === layout.id && (
                                                <Check className="h-4 w-4 text-violet-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{layout.description}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Branding */}
                <TabsContent value="branding" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo</CardTitle>
                            <CardDescription>
                                Upload your blog's logo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center">
                                    <Image className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <Button variant="outline">Upload Logo</Button>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        PNG, JPG or SVG. Recommended 200x200px.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Favicon</CardTitle>
                            <CardDescription>
                                The small icon shown in browser tabs
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                    <Layers className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <Button variant="outline">Upload Favicon</Button>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ICO, PNG or SVG. 32x32px or 64x64px.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Custom CSS</CardTitle>
                            <CardDescription>
                                Add custom CSS to further customize your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={appearance.customCss}
                                onChange={(e) => setAppearance(prev => ({ ...prev, customCss: e.target.value }))}
                                placeholder={`/* Add your custom CSS here */\n.my-class {\n  color: #8b5cf6;\n}`}
                                className="font-mono text-sm min-h-[200px]"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
