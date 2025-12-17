"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useBlogSettings, useUpdateBlogSettings } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
    Megaphone, DollarSign, Code, Layout, Eye, Save, RefreshCw, Check,
    AlertCircle, PlusCircle, Trash2, GripVertical
} from "lucide-react"

// Ad placement options
const AD_PLACEMENTS = [
    { id: "header", name: "Header", description: "Top of every page", position: "top" },
    { id: "sidebar", name: "Sidebar", description: "Right sidebar on desktop", position: "right" },
    { id: "in-article", name: "In-Article", description: "Between paragraphs", position: "inline" },
    { id: "after-post", name: "After Post", description: "Below post content", position: "bottom" },
    { id: "footer", name: "Footer", description: "Site footer area", position: "footer" },
]

// Ad providers
const AD_PROVIDERS = [
    { id: "google", name: "Google AdSense", logo: "🔷", description: "Display ads from Google" },
    { id: "carbon", name: "Carbon Ads", logo: "⬛", description: "Developer-focused ads" },
    { id: "custom", name: "Custom Ads", logo: "🎯", description: "Your own ad code" },
    { id: "sponsor", name: "Sponsorships", logo: "💼", description: "Direct sponsor placement" },
]

export default function AdsPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const { toast } = useToast()

    const { data: settings, isLoading } = useBlogSettings(userId)
    const updateSettings = useUpdateBlogSettings()

    const [adsSettings, setAdsSettings] = useState({
        enabled: true,
        adsenseId: "",
        adsTxtContent: "",
        // Placeholder for more complex ad settings if supported by backend
    })

    useEffect(() => {
        if (settings) {
            setAdsSettings({
                enabled: settings.adsEnabled ?? true,
                adsenseId: settings.adsenseId || "",
                adsTxtContent: settings.adsTxtContent || "",
            })
        }
    }, [settings])

    const handleSave = async () => {
        if (!userId) return

        try {
            await updateSettings.mutateAsync({
                userId,
                settings: {
                    adsEnabled: adsSettings.enabled,
                    adsenseId: adsSettings.adsenseId,
                    adsTxtContent: adsSettings.adsTxtContent,
                }
            })

            toast({
                title: "Settings saved",
                description: "Ad settings have been updated.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save ad settings.",
                variant: "destructive",
            })
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
                    <h1 className="text-3xl font-bold tracking-tight">Ads Management</h1>
                    <p className="text-muted-foreground">
                        Set up advertisements on your blog
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

            {/* Quick Stats - Placeholder as backend doesn't support ad stats yet */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold">$0.00</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Impressions</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <Eye className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Clicks</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <Megaphone className="h-8 w-8 text-violet-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">CTR</p>
                                <p className="text-2xl font-bold">0%</p>
                            </div>
                            <Layout className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="setup" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="setup" className="gap-2">
                        <Megaphone className="h-4 w-4" />
                        Ad Setup
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2">
                        <Code className="h-4 w-4" />
                        Advanced
                    </TabsTrigger>
                </TabsList>

                {/* Ad Setup */}
                <TabsContent value="setup" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Enable Ads</CardTitle>
                                    <CardDescription>
                                        Show advertisements on your blog
                                    </CardDescription>
                                </div>
                                <Switch
                                    checked={adsSettings.enabled}
                                    onCheckedChange={(checked) => setAdsSettings(prev => ({ ...prev, enabled: checked }))}
                                />
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Google AdSense</CardTitle>
                            <CardDescription>
                                Enter your AdSense publisher details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Publisher ID</Label>
                                <Input
                                    value={adsSettings.adsenseId}
                                    onChange={(e) => setAdsSettings(prev => ({ ...prev, adsenseId: e.target.value }))}
                                    placeholder="pub-1234567890123456"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Find this in your AdSense account settings
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced */}
                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>ads.txt File</CardTitle>
                            <CardDescription>
                                Content for your ads.txt file (required by some ad networks)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={adsSettings.adsTxtContent}
                                onChange={(e) => setAdsSettings(prev => ({ ...prev, adsTxtContent: e.target.value }))}
                                placeholder="google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
                                className="font-mono text-sm min-h-[150px]"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
