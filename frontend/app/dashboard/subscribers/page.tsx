/* eslint-disable @typescript-eslint/no-explicit-any -- Session and dynamic data type casting */
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSubscribers, useSubscriberStats, useCampaigns, useCreateCampaign } from "@/hooks/use-cms"
import { useBlogSettings, useUpdateBlogSettings } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
    Users, Mail, Download, Search, UserPlus, Send, TrendingUp,
    MailOpen, MousePointerClick, Trash2, MoreHorizontal, RefreshCw
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function SubscribersPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const { toast } = useToast()

    // Data Fetching
    const { data: subscribers = [], isLoading: isLoadingSubscribers } = useSubscribers(userId)
    const { data: stats = { total: 0, active: 0, growth: 0 }, isLoading: isLoadingStats } = useSubscriberStats(userId)
    const { data: campaigns = [], isLoading: isLoadingCampaigns } = useCampaigns(userId)
    const { data: settings } = useBlogSettings(userId)

    // Mutations
    const updateSettings = useUpdateBlogSettings()
    const createCampaign = useCreateCampaign()

    // State
    const [searchQuery, setSearchQuery] = useState("")
    const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)
    const [newCampaign, setNewCampaign] = useState({ subject: "", content: "" })
    const [newsletterSettings, setNewsletterSettings] = useState({
        enabled: true,
        doubleOptIn: true,
        welcomeEmail: true,
        weeklyDigest: false,
        newPostNotification: true,
    })


    useEffect(() => {
        if (settings) {
            setNewsletterSettings({
                enabled: settings.newsletterEnabled ?? true,
                doubleOptIn: settings.newsletterDoubleOptIn ?? true,
                welcomeEmail: settings.newsletterWelcomeEmail ?? true,
                weeklyDigest: settings.newsletterWeeklyDigest ?? false,
                newPostNotification: settings.newsletterNewPostNotification ?? true,
            })
        }
    }, [settings])

    const filteredSubscribers = subscribers.filter((sub: any) =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeSubscribers = subscribers.filter((s: any) => s.isVerified).length // Using isVerified as active
    const totalSubscribers = subscribers.length

    const handleUpdateSettings = async (key: string, value: boolean) => {
        const newSettings = { ...newsletterSettings, [key]: value }
        setNewsletterSettings(newSettings)

        if (!userId) return

        try {
            await updateSettings.mutateAsync({
                userId,
                settings: {
                    newsletterEnabled: newSettings.enabled,
                    newsletterDoubleOptIn: newSettings.doubleOptIn,
                    newsletterWelcomeEmail: newSettings.welcomeEmail,
                    newsletterWeeklyDigest: newSettings.weeklyDigest,
                    newsletterNewPostNotification: newSettings.newPostNotification,
                }
            })
            toast({ title: "Settings saved" })
        } catch {
            toast({ title: "Error", description: "Failed to save settings", variant: "destructive" })
        }
    }

    const handleCreateCampaign = async () => {
        if (!userId || !newCampaign.subject) return

        try {
            await createCampaign.mutateAsync({
                userId,
                subject: newCampaign.subject,
                content: newCampaign.content,
                status: "DRAFT" // Start as draft
            })
            setIsCampaignDialogOpen(false)
            setNewCampaign({ subject: "", content: "" })
            toast({ title: "Campaign created", description: "Draft campaign created successfully" })
        } catch {
            toast({ title: "Error", description: "Failed to create campaign", variant: "destructive" })
        }
    }

    if (isLoadingSubscribers || isLoadingStats || isLoadingCampaigns) {
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
                    <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
                    <p className="text-muted-foreground">
                        Manage your newsletter subscribers and email campaigns
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Send className="mr-2 h-4 w-4" />
                                New Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Campaign</DialogTitle>
                                <DialogDescription>Draft a new email campaign</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Input
                                        value={newCampaign.subject}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                                        placeholder="e.g. Weekly Update"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Content (HTML/Markdown)</Label>
                                    <Textarea
                                        value={newCampaign.content}
                                        onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Hello there..."
                                        rows={5}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending}>
                                    {createCampaign.isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Draft
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                                <p className="text-2xl font-bold">{totalSubscribers}</p>
                            </div>
                            <Users className="h-8 w-8 text-violet-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active (Verified)</p>
                                <p className="text-2xl font-bold">{activeSubscribers}</p>
                            </div>
                            <UserPlus className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                                <p className="text-2xl font-bold">{stats.avgOpenRate ? `${stats.avgOpenRate}%` : 'N/A'}</p>
                            </div>
                            <MailOpen className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Click Rate</p>
                                <p className="text-2xl font-bold">{stats.avgClickRate ? `${stats.avgClickRate}%` : 'N/A'}</p>
                            </div>
                            <MousePointerClick className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="subscribers" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="subscribers" className="gap-2">
                        <Users className="h-4 w-4" />
                        Subscribers
                    </TabsTrigger>
                    <TabsTrigger value="campaigns" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Campaigns
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                {/* Subscribers List */}
                <TabsContent value="subscribers" className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search subscribers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            {filteredSubscribers.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No subscribers found</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredSubscribers.map((subscriber: any) => (
                                        <div key={subscriber.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>{(subscriber.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{subscriber.email}</p>
                                                    <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={subscriber.isVerified ? "default" : "secondary"}>
                                                    {subscriber.isVerified ? "Verified" : "Pending"}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(subscriber.createdAt).toLocaleDateString()}
                                                </span>
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

                {/* Campaigns */}
                <TabsContent value="campaigns" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Campaigns</CardTitle>
                            <CardDescription>
                                View and manage your newsletter campaigns
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {campaigns.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No campaigns yet</p>
                                    </div>
                                ) : (
                                    campaigns.map((campaign: any) => (
                                        <div key={campaign.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                            <div>
                                                <p className="font-medium">{campaign.subject}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {campaign.sentAt ? `Sent on ${new Date(campaign.sentAt).toLocaleDateString()}` : "Draft"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                {campaign.status === "SENT" ? (
                                                    <>
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium">{campaign.recipientsCount || 0}</p>
                                                            <p className="text-xs text-muted-foreground">Sent</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium">{campaign.openedCount || 0}</p>
                                                            <p className="text-xs text-muted-foreground">Opened</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium">{campaign.clickedCount || 0}</p>
                                                            <p className="text-xs text-muted-foreground">Clicked</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Badge variant="secondary">{campaign.status}</Badge>
                                                )}
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Newsletter Settings</CardTitle>
                            <CardDescription>
                                Configure your newsletter preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Enable Newsletter</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Show subscription form on your blog
                                    </p>
                                </div>
                                <Switch
                                    checked={newsletterSettings.enabled}
                                    onCheckedChange={(checked) => handleUpdateSettings('enabled', checked)}
                                    disabled={updateSettings.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Double Opt-in</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require email confirmation
                                    </p>
                                </div>
                                <Switch
                                    checked={newsletterSettings.doubleOptIn}
                                    onCheckedChange={(checked) => handleUpdateSettings('doubleOptIn', checked)}
                                    disabled={updateSettings.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Welcome Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send welcome email to new subscribers
                                    </p>
                                </div>
                                <Switch
                                    checked={newsletterSettings.welcomeEmail}
                                    onCheckedChange={(checked) => handleUpdateSettings('welcomeEmail', checked)}
                                    disabled={updateSettings.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>New Post Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notify subscribers of new posts
                                    </p>
                                </div>
                                <Switch
                                    checked={newsletterSettings.newPostNotification}
                                    onCheckedChange={(checked) => handleUpdateSettings('newPostNotification', checked)}
                                    disabled={updateSettings.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Weekly Digest</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send weekly content summary
                                    </p>
                                </div>
                                <Switch
                                    checked={newsletterSettings.weeklyDigest}
                                    onCheckedChange={(checked) => handleUpdateSettings('weeklyDigest', checked)}
                                    disabled={updateSettings.isPending}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
