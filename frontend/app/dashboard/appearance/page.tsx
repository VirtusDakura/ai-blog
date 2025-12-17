"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useBlogSettings, useUpdateBlogSettings } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUpload from "@/components/ui/image-upload"
import { useToast } from "@/hooks/use-toast"
import {
    Palette, Layout, Type, Image, Moon, Sun, Monitor, Check, Save, RefreshCw,
    Paintbrush, Layers, Eye
} from "lucide-react"

// Theme options
const THEMES = [
    {
        id: "minimal",
        name: "Minimal",
        description: "Cluttered-free design focused on readability",
        preview: "bg-white dark:bg-zinc-900 border",
        colors: ["#ffffff", "#f4f4f5", "#18181b"]
    },
    {
        id: "modern",
        name: "Modern",
        description: "Contemporary aesthetic with subtle gradients",
        preview: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border",
        colors: ["#f8fafc", "#e2e8f0", "#1e293b"]
    },
    {
        id: "bold",
        name: "Bold",
        description: "High contrast design that makes a statement",
        preview: "bg-zinc-950 dark:bg-black border-2 border-primary",
        colors: ["#7c3aed", "#a855f7", "#ffffff"]
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Sophisticated typography and warm tones",
        preview: "bg-stone-50 dark:bg-stone-900 border",
        colors: ["#fffbeb", "#fed7aa", "#78350f"]
    },
    {
        id: "tech",
        name: "Tech Blog",
        description: "Optimized for code snippets and tutorials",
        preview: "bg-slate-900 border border-indigo-500/30",
        colors: ["#1e293b", "#3b82f6", "#cbd5e1"]
    },
    {
        id: "magazine",
        name: "Magazine",
        description: "Grid-based layout for content-heavy sites",
        preview: "grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-900 p-2",
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
    { id: "inter", name: "Inter (Sans-serif)", preview: "font-sans" },
    { id: "georgia", name: "Georgia (Serif)", preview: "font-serif" },
    { id: "mono", name: "Monospace", preview: "font-mono" },
    { id: "outfit", name: "Outfit (Modern Sans)", preview: "font-[family-name:var(--font-outfit)]" },
    { id: "merriweather", name: "Merriweather (Readability)", preview: "font-serif" },
]

// Layout options
const LAYOUTS = [
    { id: "standard", name: "Standard", description: "Classic blog layout with sidebar" },
    { id: "wide", name: "Full Width", description: "Immersive reading experience without sidebar" },
    { id: "grid", name: "Card Grid", description: "Showcase multiple posts in a responsive grid" },
    { id: "minimal", name: "Minimal List", description: "Clean list of posts focused on titles" },
]

export default function AppearancePage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const { toast } = useToast()

    // Fetch blog settings
    const { data: settings, isLoading: isLoadingSettings } = useBlogSettings(userId)
    const updateSettings = useUpdateBlogSettings()

    const [appearance, setAppearance] = useState({
        theme: "minimal",
        colorScheme: "violet",
        font: "inter",
        layout: "standard",
        darkMode: "system",
        customCss: "",
        logoUrl: "",
        faviconUrl: "",
        headerCode: "",
        footerCode: "",
    })

    // Update state when settings are loaded
    useEffect(() => {
        if (settings) {
            setAppearance({
                theme: settings.theme || "minimal",
                colorScheme: settings.colorScheme || "violet",
                font: settings.font || "inter",
                layout: settings.layout || "standard",
                darkMode: settings.darkMode ? "dark" : "system",
                customCss: settings.customCss || "",
                logoUrl: settings.logoUrl || "",
                faviconUrl: settings.faviconUrl || "",
                headerCode: settings.headerCode || "",
                footerCode: settings.footerCode || "",
            })
        }
    }, [settings])

    const handleSave = async () => {
        if (!userId) return

        try {
            await updateSettings.mutateAsync({
                userId,
                settings: {
                    theme: appearance.theme,
                    colorScheme: appearance.colorScheme,
                    font: appearance.font,
                    layout: appearance.layout,
                    darkMode: appearance.darkMode === "dark",
                    customCss: appearance.customCss,
                    logoUrl: appearance.logoUrl,
                    faviconUrl: appearance.faviconUrl,
                    headerCode: appearance.headerCode,
                    footerCode: appearance.footerCode,
                }
            })

            toast({
                title: "Changes saved",
                description: "Your blog appearance has been updated successfully.",
            })
        } catch (error) {
            console.error("Failed to save appearance:", error)
            toast({
                title: "Error",
                description: "Failed to save changes. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoadingSettings) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
                    <p className="text-muted-foreground">
                        Customize how your blog looks and feels
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Blog
                    </Button>
                    <Button onClick={handleSave} disabled={updateSettings.isPending}>
                        {updateSettings.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="theme" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
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
                                Select a pre-designed theme base to start with
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setAppearance(prev => ({ ...prev, theme: theme.id }))}
                                        className={`
                                            relative p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]
                                            ${appearance.theme === theme.id
                                                ? "border-violet-500 ring-2 ring-violet-500/20 bg-violet-500/5"
                                                : "border-border hover:border-violet-500/50"
                                            }
                                        `}
                                    >
                                        {appearance.theme === theme.id && (
                                            <div className="absolute top-2 right-2 p-1 rounded-full bg-violet-500 text-white z-10">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                        <div className={`h-24 rounded-lg mb-3 shadow-sm ${theme.preview}`} />
                                        <h4 className="font-semibold">{theme.name}</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Color Mode</CardTitle>
                            <CardDescription>
                                Set the default color mode for your visitors
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
                                                ? "border-violet-500 bg-violet-500/5 text-violet-600"
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
                                Choose your blog's primary accent color used for buttons, links, and highlights
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {COLOR_SCHEMES.map((scheme) => (
                                    <button
                                        key={scheme.id}
                                        onClick={() => setAppearance(prev => ({ ...prev, colorScheme: scheme.id }))}
                                        className={`
                                            flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all
                                            ${appearance.colorScheme === scheme.id
                                                ? "border-current ring-2 ring-current/20 bg-muted/50"
                                                : "border-transparent hover:border-muted-foreground/20 bg-muted/20"
                                            }
                                        `}
                                        style={{
                                            borderColor: appearance.colorScheme === scheme.id ? scheme.color : undefined,
                                            color: appearance.colorScheme === scheme.id ? scheme.color : undefined
                                        }}
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full shadow-sm"
                                            style={{ backgroundColor: scheme.color }}
                                        />
                                        <span className={`font-medium ${appearance.colorScheme === scheme.id ? '' : 'text-foreground'}`}>
                                            {scheme.name}
                                        </span>
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
                            <CardTitle>Custom CSS</CardTitle>
                            <CardDescription>
                                Add custom CSS to further customize your blog's appearance (Advanced)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={appearance.customCss}
                                onChange={(e) => setAppearance(prev => ({ ...prev, customCss: e.target.value }))}
                                placeholder={`/* Add your custom CSS here */\n.my-custom-class {\n  border: 1px solid red;\n}`}
                                className="font-mono text-sm min-h-[200px]"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Typography */}
                <TabsContent value="typography" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Font Family</CardTitle>
                            <CardDescription>
                                Choose the primary font for your blog content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {FONTS.map((font) => (
                                <button
                                    key={font.id}
                                    onClick={() => setAppearance(prev => ({ ...prev, font: font.id }))}
                                    className={`
                                        w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left
                                        ${appearance.font === font.id
                                            ? "border-violet-500 bg-violet-500/5"
                                            : "border-border hover:border-violet-500/50"
                                        }
                                    `}
                                >
                                    <div>
                                        <p className={`text-lg font-semibold ${font.preview}`}>{font.name}</p>
                                        <p className={`text-sm text-muted-foreground mt-1 ${font.preview}`}>
                                            The quick brown fox jumps over the lazy dog. 1234567890
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
                            <CardTitle>Post Layout</CardTitle>
                            <CardDescription>
                                Choose how your blog posts are displayed on the home page
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
                                                ? "border-violet-500 bg-violet-500/5"
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Header & Footer Code</CardTitle>
                            <CardDescription>
                                Add custom scripts that run in the head or body (e.g., Google Analytics, custom widgets)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Header Code (Inside &lt;head&gt;)</Label>
                                <Textarea
                                    value={appearance.headerCode}
                                    onChange={(e) => setAppearance(prev => ({ ...prev, headerCode: e.target.value }))}
                                    placeholder="<script>...</script>"
                                    className="font-mono text-xs min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Footer Code (Before &lt;/body&gt;)</Label>
                                <Textarea
                                    value={appearance.footerCode}
                                    onChange={(e) => setAppearance(prev => ({ ...prev, footerCode: e.target.value }))}
                                    placeholder="<script>...</script>"
                                    className="font-mono text-xs min-h-[100px]"
                                />
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
                                Upload your blog's logo. Recommended size: 200x50px transparent PNG.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ImageUpload
                                value={appearance.logoUrl ? [appearance.logoUrl] : []}
                                onChange={(url) => setAppearance(prev => ({ ...prev, logoUrl: url }))}
                                onRemove={() => setAppearance(prev => ({ ...prev, logoUrl: "" }))}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Favicon</CardTitle>
                            <CardDescription>
                                The small icon shown in browser tabs. Recommended size: 32x32px or 64x64px.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ImageUpload
                                value={appearance.faviconUrl ? [appearance.faviconUrl] : []}
                                onChange={(url) => setAppearance(prev => ({ ...prev, faviconUrl: url }))}
                                onRemove={() => setAppearance(prev => ({ ...prev, faviconUrl: "" }))}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
