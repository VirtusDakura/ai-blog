"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useBlog } from "@/contexts/blog-context"
import { useBlogSettings, useUpdateBlogSettings } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import ImageUpload from "@/components/ui/image-upload"
import { useToast } from "@/hooks/use-toast"
import {
    Search, Globe, FileText, Image as ImageIcon, Link2, Check, AlertCircle,
    Save, RefreshCw, Copy, Sparkles
} from "lucide-react"

export default function SEOPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const blog = useBlog()
    const { toast } = useToast()

    // Fetch settings
    const { data: settings, isLoading: isLoadingSettings } = useBlogSettings(userId)
    const updateSettings = useUpdateBlogSettings()

    const [seoSettings, setSeoSettings] = useState({
        // Meta Tags
        siteTitle: blog.blogName || "",
        metaDescription: blog.blogDescription || "",
        keywords: "",

        // Social
        ogImage: "",
        twitterHandle: "",
        facebookPage: "",

        // Technical
        enableJsonLd: true,
        enableSitemap: true,
        canonicalUrl: "",
    })

    // Load data
    useEffect(() => {
        if (settings) {
            setSeoSettings(prev => ({
                ...prev,
                siteTitle: settings.seoTitle || blog.blogName || "",
                metaDescription: settings.seoDescription || blog.blogDescription || "",
                keywords: settings.seoKeywords || "",
                ogImage: settings.ogImage || "",
                twitterHandle: settings.twitterHandle || "",
                facebookPage: settings.facebookPage || "",
                enableJsonLd: settings.enableJsonLd ?? true,
                enableSitemap: settings.enableSitemap ?? true,
                canonicalUrl: settings.canonicalUrl || "",
            }))
        }
    }, [settings, blog.blogName, blog.blogDescription])

    // SEO Score calculation
    const calculateSeoScore = () => {
        let score = 0
        if (seoSettings.siteTitle && seoSettings.siteTitle.length >= 10) score += 20
        if (seoSettings.metaDescription && seoSettings.metaDescription.length >= 50) score += 20
        if (seoSettings.keywords && seoSettings.keywords.length > 0) score += 15
        if (seoSettings.ogImage) score += 15
        if (seoSettings.enableSitemap) score += 10
        if (seoSettings.enableJsonLd) score += 10
        if (seoSettings.canonicalUrl || blog.subdomain) score += 10
        return Math.min(score, 100)
    }

    const seoScore = calculateSeoScore()

    const handleSave = async () => {
        if (!userId) return

        try {
            await updateSettings.mutateAsync({
                userId,
                settings: {
                    seoTitle: seoSettings.siteTitle,
                    seoDescription: seoSettings.metaDescription,
                    seoKeywords: seoSettings.keywords,
                    ogImage: seoSettings.ogImage,
                    twitterHandle: seoSettings.twitterHandle,
                    facebookPage: seoSettings.facebookPage,
                    enableJsonLd: seoSettings.enableJsonLd,
                    enableSitemap: seoSettings.enableSitemap,
                    canonicalUrl: seoSettings.canonicalUrl,
                }
            })

            toast({
                title: "Settings saved",
                description: "Your SEO settings have been updated.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save SEO settings.",
                variant: "destructive",
            })
        }
    }

    const generateWithAI = async (field: string) => {
        // Simulate AI generation - in a real app this would call openai/anthropic
        toast({ title: "AI Generation", description: "This would call the AI service in production." });

        if (field === "description") {
            setSeoSettings(prev => ({
                ...prev,
                metaDescription: `Discover insightful articles, tutorials, and tips on ${seoSettings.siteTitle}. Stay updated with the latest trends and expert knowledge.`
            }))
        } else if (field === "keywords") {
            setSeoSettings(prev => ({
                ...prev,
                keywords: "blog, articles, tutorials, tips, insights, technology, learning"
            }))
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
                    <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
                    <p className="text-muted-foreground">
                        Optimize your blog for search engines
                    </p>
                </div>
                <div className="flex items-center gap-3">
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

            {/* SEO Score Card */}
            <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">SEO Score</h3>
                            <p className="text-sm text-muted-foreground">
                                Based on your current settings
                            </p>
                        </div>
                        <div className="text-right">
                            <span className={`text-4xl font-bold ${seoScore >= 80 ? "text-green-500" :
                                seoScore >= 60 ? "text-yellow-500" :
                                    "text-red-500"
                                }`}>
                                {seoScore}
                            </span>
                            <span className="text-2xl text-muted-foreground">/100</span>
                        </div>
                    </div>
                    <Progress value={seoScore} className="h-3" />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            {seoSettings.siteTitle ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>Title Tag</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {seoSettings.metaDescription ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>Meta Description</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {seoSettings.ogImage ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>OG Image</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {seoSettings.enableSitemap ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>Sitemap</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="meta" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="meta" className="gap-2">
                        <Search className="h-4 w-4" />
                        Meta Tags
                    </TabsTrigger>
                    <TabsTrigger value="social" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Social Media
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Technical
                    </TabsTrigger>
                </TabsList>

                {/* Meta Tags */}
                <TabsContent value="meta" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Engine Preview</CardTitle>
                            <CardDescription>
                                How your blog appears in search results
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border">
                                <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer">
                                    {seoSettings.siteTitle || "Your Blog Title"}
                                </p>
                                <p className="text-green-700 dark:text-green-500 text-sm">
                                    {blog.subdomain}.ai-blog.vercel.app
                                </p>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {seoSettings.metaDescription || "Add a meta description to tell search engines what your blog is about..."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Meta Information</CardTitle>
                            <CardDescription>
                                Configure your site's meta tags
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteTitle">Site Title</Label>
                                <Input
                                    id="siteTitle"
                                    value={seoSettings.siteTitle}
                                    onChange={(e) => setSeoSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                                    placeholder="Your Blog Name"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {seoSettings.siteTitle.length}/60 characters (recommended)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => generateWithAI("description")}
                                    >
                                        <Sparkles className="mr-1 h-3 w-3" />
                                        Generate with AI
                                    </Button>
                                </div>
                                <Textarea
                                    id="metaDescription"
                                    value={seoSettings.metaDescription}
                                    onChange={(e) => setSeoSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
                                    placeholder="A brief description of your blog for search engines..."
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {seoSettings.metaDescription.length}/160 characters (recommended)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="keywords">Focus Keywords</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => generateWithAI("keywords")}
                                    >
                                        <Sparkles className="mr-1 h-3 w-3" />
                                        Suggest Keywords
                                    </Button>
                                </div>
                                <Input
                                    id="keywords"
                                    value={seoSettings.keywords}
                                    onChange={(e) => setSeoSettings(prev => ({ ...prev, keywords: e.target.value }))}
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Media */}
                <TabsContent value="social" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Open Graph Image</CardTitle>
                            <CardDescription>
                                Default image when sharing on social media
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ImageUpload
                                value={seoSettings.ogImage ? [seoSettings.ogImage] : []}
                                onChange={(url) => setSeoSettings(prev => ({ ...prev, ogImage: url }))}
                                onRemove={() => setSeoSettings(prev => ({ ...prev, ogImage: "" }))}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Recommended: 1200 x 630 pixels
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Social Profiles</CardTitle>
                            <CardDescription>
                                Link your social media accounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="twitterHandle">Twitter / X Handle</Label>
                                <div className="flex">
                                    <span className="flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground">@</span>
                                    <Input
                                        id="twitterHandle"
                                        value={seoSettings.twitterHandle}
                                        onChange={(e) => setSeoSettings(prev => ({ ...prev, twitterHandle: e.target.value }))}
                                        placeholder="yourusername"
                                        className="rounded-l-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebookPage">Facebook Page URL</Label>
                                <Input
                                    id="facebookPage"
                                    value={seoSettings.facebookPage}
                                    onChange={(e) => setSeoSettings(prev => ({ ...prev, facebookPage: e.target.value }))}
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Technical */}
                <TabsContent value="technical" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sitemap & Robots</CardTitle>
                            <CardDescription>
                                Help search engines crawl your site
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Generate Sitemap</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically generate sitemap.xml
                                    </p>
                                </div>
                                <Switch
                                    checked={seoSettings.enableSitemap}
                                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, enableSitemap: checked }))}
                                />
                            </div>
                            {seoSettings.enableSitemap && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                    <Link2 className="h-4 w-4" />
                                    <code className="text-sm flex-1">{blog.subdomain}.ai-blog.vercel.app/sitemap.xml</code>
                                    <Button variant="ghost" size="sm">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Structured Data (JSON-LD)</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable rich snippets in search results
                                    </p>
                                </div>
                                <Switch
                                    checked={seoSettings.enableJsonLd}
                                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, enableJsonLd: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Canonical URL</CardTitle>
                            <CardDescription>
                                Set the preferred URL for your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                                <Input
                                    id="canonicalUrl"
                                    value={seoSettings.canonicalUrl}
                                    onChange={(e) => setSeoSettings(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                                    placeholder={`https://${blog.subdomain}.ai-blog.vercel.app`}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Leave empty to use default URL
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
