"use client"

import { useState } from "react"
import { useBlog } from "@/contexts/blog-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    Search, Globe, FileText, Image, Link2, BarChart3, Check, AlertCircle,
    Save, RefreshCw, ExternalLink, Copy, Sparkles
} from "lucide-react"

export default function SEOPage() {
    const blog = useBlog()
    const [isLoading, setIsLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const [seoSettings, setSeoSettings] = useState({
        // Meta Tags
        siteTitle: blog.blogName || "",
        titleSeparator: "-",
        metaDescription: blog.blogDescription || "",
        keywords: "",

        // Social
        ogImage: "",
        twitterHandle: "",
        facebookPage: "",

        // Technical
        enableJsonLd: true,
        enableSitemap: true,
        enableRobots: true,
        canonicalUrl: "",

        // Content
        autoMetaDescription: true,
        autoOgImage: true,
    })

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
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        setIsLoading(false)
    }

    const generateWithAI = async (field: string) => {
        // Simulate AI generation
        if (field === "description") {
            setSeoSettings(prev => ({
                ...prev,
                metaDescription: "Discover insightful articles, tutorials, and tips on our blog. Stay updated with the latest trends and expert knowledge in our field."
            }))
        } else if (field === "keywords") {
            setSeoSettings(prev => ({
                ...prev,
                keywords: "blog, articles, tutorials, tips, insights, technology"
            }))
        }
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
                    {saveSuccess && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Saved!</span>
                        </div>
                    )}
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
                                    {seoSettings.siteTitle || "Your Blog Title"} {seoSettings.titleSeparator} AI Blog Platform
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
                            <div className="grid gap-4 md:grid-cols-2">
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
                                    <Label htmlFor="titleSeparator">Title Separator</Label>
                                    <select
                                        id="titleSeparator"
                                        value={seoSettings.titleSeparator}
                                        onChange={(e) => setSeoSettings(prev => ({ ...prev, titleSeparator: e.target.value }))}
                                        className="w-full h-10 px-3 rounded-md border bg-background"
                                    >
                                        <option value="-">- (Dash)</option>
                                        <option value="|">| (Pipe)</option>
                                        <option value="•">• (Bullet)</option>
                                        <option value="–">– (En Dash)</option>
                                    </select>
                                </div>
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
                            <div className="flex items-center gap-6">
                                <div className="h-32 w-56 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed">
                                    {seoSettings.ogImage ? (
                                        <img src={seoSettings.ogImage} alt="OG" className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <Image className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <Button variant="outline">Upload Image</Button>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Recommended: 1200 x 630 pixels
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                <div>
                                    <Label>Auto-generate OG Images</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Generate unique images for each post
                                    </p>
                                </div>
                                <Switch
                                    checked={seoSettings.autoOgImage}
                                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, autoOgImage: checked }))}
                                />
                            </div>
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
                                    <Label>Generate Robots.txt</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Control search engine crawling
                                    </p>
                                </div>
                                <Switch
                                    checked={seoSettings.enableRobots}
                                    onCheckedChange={(checked) => setSeoSettings(prev => ({ ...prev, enableRobots: checked }))}
                                />
                            </div>
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
