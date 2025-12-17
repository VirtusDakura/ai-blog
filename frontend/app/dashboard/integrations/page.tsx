"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useBlogSettings, useUpdateBlogSettings, useIntegrations, useUpdateIntegration } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
    Code, Puzzle, Check, ExternalLink, Settings, Zap, BarChart3,
    MessageSquare, Share2, Shield, RefreshCw, Save
} from "lucide-react"

// Available integrations
const AVAILABLE_INTEGRATIONS = [
    {
        id: "google-analytics",
        name: "Google Analytics",
        description: "Track website traffic and user behavior",
        icon: "📊",
        category: "analytics",
        popular: true,
    },
    {
        id: "disqus",
        name: "Disqus",
        description: "Third-party commenting system",
        icon: "�",
        category: "comments",
        popular: true,
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Email marketing platform",
        icon: "�",
        category: "email",
        popular: true,
    },
    {
        id: "twitter",
        name: "Twitter / X",
        description: "Share posts to Twitter",
        icon: "�",
        category: "social",
        popular: true,
    },
    {
        id: "cloudinary",
        name: "Cloudinary",
        description: "Image optimization and CDN (Built-in)",
        icon: "�️",
        category: "media",
        popular: true,
        builtIn: true,
    },
]

const categories = [
    { id: "all", name: "All", icon: Puzzle },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "comments", name: "Comments", icon: MessageSquare },
    { id: "email", name: "Email", icon: Zap },
    { id: "social", name: "Social", icon: Share2 },
    { id: "media", name: "Media", icon: Shield },
]

export default function IntegrationsPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const blogId = (session?.user as any)?.blogId // Assuming we have blogId in session or fetch it

    // In a real app we'd get blogId from context or user profile
    // For now we'll assume we fetch blog settings via userId which implies the blog

    const { data: settings, isLoading: isLoadingSettings } = useBlogSettings(userId)
    const updateSettings = useUpdateBlogSettings()

    // For specific integration status (like API keys etc stored separately)
    // we would use useIntegrations(blogId) but currently everything is in blog settings or simple toggles

    const { toast } = useToast()

    const [connected, setConnected] = useState<Record<string, boolean>>({})
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // Custom code settings
    const [customCode, setCustomCode] = useState({
        headerCode: "",
        footerCode: "",
        analyticsId: "",
    })

    useEffect(() => {
        if (settings) {
            setCustomCode({
                headerCode: settings.headerCode || "",
                footerCode: settings.footerCode || "",
                analyticsId: settings.analyticsId || "",
            })

            // Map settings to connected state
            setConnected({
                "google-analytics": !!settings.analyticsId,
                "cloudinary": true, // Always true as it's built-in
                // Add others as we implement them in backend
            })
        }
    }, [settings])

    const handleSaveCode = async () => {
        if (!userId) return

        try {
            await updateSettings.mutateAsync({
                userId,
                settings: {
                    headerCode: customCode.headerCode,
                    footerCode: customCode.footerCode,
                    analyticsId: customCode.analyticsId,
                }
            })

            toast({
                title: "Settings saved",
                description: "Your integration settings have been updated.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive",
            })
        }
    }

    const filteredIntegrations = AVAILABLE_INTEGRATIONS.filter(integration => {
        if (selectedCategory !== "all" && integration.category !== selectedCategory) return false
        if (searchQuery && !integration.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    const connectedCount = Object.values(connected).filter(Boolean).length

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
                    <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                    <p className="text-muted-foreground">
                        Connect third-party services to enhance your blog
                    </p>
                </div>
                <Badge variant="outline" className="text-sm">
                    {connectedCount} connected
                </Badge>
            </div>

            <Tabs defaultValue="integrations" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="integrations" className="gap-2">
                        <Puzzle className="h-4 w-4" />
                        Integrations
                    </TabsTrigger>
                    <TabsTrigger value="code" className="gap-2">
                        <Code className="h-4 w-4" />
                        Custom Code
                    </TabsTrigger>
                </TabsList>

                {/* Integrations */}
                <TabsContent value="integrations" className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const Icon = category.icon
                            return (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className="gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    {category.name}
                                </Button>
                            )
                        })}
                    </div>

                    {/* Search */}
                    <Input
                        placeholder="Search integrations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />

                    {/* Integrations Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredIntegrations.map((integration) => (
                            <Card key={integration.id} className="relative">
                                {integration.popular && (
                                    <Badge className="absolute top-3 right-3 bg-violet-500">Popular</Badge>
                                )}
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{integration.icon}</span>
                                        <div>
                                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                                            <CardDescription>{integration.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        {connected[integration.id] ? (
                                            <>
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                    <span className="text-sm font-medium">Connected</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                    {!integration.builtIn && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setConnected(prev => ({ ...prev, [integration.id]: false }))}
                                                        >
                                                            Disconnect
                                                        </Button>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={() => setConnected(prev => ({ ...prev, [integration.id]: true }))}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Custom Code */}
                <TabsContent value="code" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics ID</CardTitle>
                            <CardDescription>
                                Enter your Google Analytics or other tracking ID
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Google Analytics ID</Label>
                                <Input
                                    value={customCode.analyticsId}
                                    onChange={(e) => setCustomCode(prev => ({ ...prev, analyticsId: e.target.value }))}
                                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Header Code</CardTitle>
                            <CardDescription>
                                Code added to the &lt;head&gt; section of every page
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={customCode.headerCode}
                                onChange={(e) => setCustomCode(prev => ({ ...prev, headerCode: e.target.value }))}
                                placeholder="<!-- Add your header scripts here -->"
                                className="w-full min-h-[150px] font-mono text-sm"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Footer Code</CardTitle>
                            <CardDescription>
                                Code added before the closing &lt;/body&gt; tag
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={customCode.footerCode}
                                onChange={(e) => setCustomCode(prev => ({ ...prev, footerCode: e.target.value }))}
                                placeholder="<!-- Add your footer scripts here -->"
                                className="w-full min-h-[150px] font-mono text-sm"
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSaveCode} disabled={updateSettings.isPending}>
                            {updateSettings.isPending ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
