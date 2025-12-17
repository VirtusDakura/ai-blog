"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
    const [isLoading, setIsLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const [adsSettings, setAdsSettings] = useState({
        enabled: true,
        provider: "google",
        publisherId: "",
        placements: {
            header: { enabled: false, code: "" },
            sidebar: { enabled: true, code: "" },
            "in-article": { enabled: true, code: "" },
            "after-post": { enabled: true, code: "" },
            footer: { enabled: false, code: "" },
        },
        autoAds: false,
        hideOnMobile: false,
        adsTxt: "",
    })

    const [sponsors, setSponsors] = useState([
        { id: 1, name: "TechCorp", logo: "", link: "https://techcorp.com", placement: "sidebar", active: true },
    ])

    const handleSave = async () => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        setIsLoading(false)
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

            {/* Quick Stats */}
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
                    <TabsTrigger value="placements" className="gap-2">
                        <Layout className="h-4 w-4" />
                        Placements
                    </TabsTrigger>
                    <TabsTrigger value="sponsors" className="gap-2">
                        <DollarSign className="h-4 w-4" />
                        Sponsors
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
                            <CardTitle>Ad Provider</CardTitle>
                            <CardDescription>
                                Choose your advertising network
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {AD_PROVIDERS.map((provider) => (
                                    <button
                                        key={provider.id}
                                        onClick={() => setAdsSettings(prev => ({ ...prev, provider: provider.id }))}
                                        className={`
                                            flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all
                                            ${adsSettings.provider === provider.id
                                                ? "border-violet-500 bg-violet-500/5"
                                                : "border-border hover:border-violet-500/50"
                                            }
                                        `}
                                    >
                                        <span className="text-3xl">{provider.logo}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{provider.name}</h4>
                                                {adsSettings.provider === provider.id && (
                                                    <Check className="h-4 w-4 text-violet-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {adsSettings.provider === "google" && (
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
                                        value={adsSettings.publisherId}
                                        onChange={(e) => setAdsSettings(prev => ({ ...prev, publisherId: e.target.value }))}
                                        placeholder="pub-1234567890123456"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Find this in your AdSense account settings
                                    </p>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                    <div>
                                        <Label>Auto Ads</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Let Google automatically place ads
                                        </p>
                                    </div>
                                    <Switch
                                        checked={adsSettings.autoAds}
                                        onCheckedChange={(checked) => setAdsSettings(prev => ({ ...prev, autoAds: checked }))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Placements */}
                <TabsContent value="placements" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ad Placements</CardTitle>
                            <CardDescription>
                                Choose where ads appear on your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {AD_PLACEMENTS.map((placement) => (
                                <div
                                    key={placement.id}
                                    className="flex items-center justify-between p-4 rounded-lg border"
                                >
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{placement.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {placement.position}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {placement.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={(adsSettings.placements as any)[placement.id]?.enabled || false}
                                        onCheckedChange={(checked) => setAdsSettings(prev => ({
                                            ...prev,
                                            placements: {
                                                ...prev.placements,
                                                [placement.id]: { ...((prev.placements as any)[placement.id] || {}), enabled: checked }
                                            }
                                        }))}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Display Options</CardTitle>
                            <CardDescription>
                                Additional ad display settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Hide on Mobile</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Don't show ads on mobile devices
                                    </p>
                                </div>
                                <Switch
                                    checked={adsSettings.hideOnMobile}
                                    onCheckedChange={(checked) => setAdsSettings(prev => ({ ...prev, hideOnMobile: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Sponsors */}
                <TabsContent value="sponsors" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Direct Sponsors</CardTitle>
                                    <CardDescription>
                                        Manage your sponsor placements
                                    </CardDescription>
                                </div>
                                <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Sponsor
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {sponsors.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No sponsors yet</p>
                                    <p className="text-sm">Add your first sponsor to display on your blog</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sponsors.map((sponsor) => (
                                        <div
                                            key={sponsor.id}
                                            className="flex items-center justify-between p-4 rounded-lg border"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                    💼
                                                </div>
                                                <div>
                                                    <p className="font-medium">{sponsor.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {sponsor.placement} • {sponsor.link}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={sponsor.active ? "default" : "secondary"}>
                                                    {sponsor.active ? "Active" : "Inactive"}
                                                </Badge>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                value={adsSettings.adsTxt}
                                onChange={(e) => setAdsSettings(prev => ({ ...prev, adsTxt: e.target.value }))}
                                placeholder="google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
                                className="font-mono text-sm min-h-[150px]"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Ad Code</CardTitle>
                            <CardDescription>
                                Add custom ad scripts for specific placements
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Header Ad Code</Label>
                                <Textarea
                                    placeholder="<script>...</script>"
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>In-Article Ad Code</Label>
                                <Textarea
                                    placeholder="<script>...</script>"
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
