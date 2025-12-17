"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users, Mail, Download, Search, UserPlus, Send, TrendingUp,
    MailOpen, MousePointerClick, Trash2, MoreHorizontal
} from "lucide-react"

// Mock subscribers data
const mockSubscribers = [
    { id: 1, email: "john@example.com", name: "John Doe", subscribed: "2024-12-15", status: "active" },
    { id: 2, email: "jane@example.com", name: "Jane Smith", subscribed: "2024-12-14", status: "active" },
    { id: 3, email: "bob@example.com", name: "Bob Wilson", subscribed: "2024-12-10", status: "active" },
    { id: 4, email: "alice@example.com", name: "Alice Brown", subscribed: "2024-12-08", status: "unsubscribed" },
]

// Mock newsletter campaigns
const mockCampaigns = [
    { id: 1, subject: "Weekly Digest - Dec 16", sent: "2024-12-16", recipients: 45, opened: 32, clicked: 12, status: "sent" },
    { id: 2, subject: "New Post: AI in 2025", sent: "2024-12-10", recipients: 42, opened: 28, clicked: 15, status: "sent" },
    { id: 3, subject: "Welcome to Our Blog!", sent: null, recipients: 0, opened: 0, clicked: 0, status: "draft" },
]

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState(mockSubscribers)
    const [searchQuery, setSearchQuery] = useState("")
    const [newsletterSettings, setNewsletterSettings] = useState({
        enabled: true,
        doubleOptIn: true,
        welcomeEmail: true,
        weeklyDigest: false,
        newPostNotification: true,
    })

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeSubscribers = subscribers.filter(s => s.status === "active").length
    const totalSubscribers = subscribers.length

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
                    <Button>
                        <Send className="mr-2 h-4 w-4" />
                        New Campaign
                    </Button>
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
                                <p className="text-sm text-muted-foreground">Active</p>
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
                                <p className="text-2xl font-bold">68%</p>
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
                                <p className="text-2xl font-bold">24%</p>
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
                                    {filteredSubscribers.map((subscriber) => (
                                        <div key={subscriber.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>{subscriber.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{subscriber.name}</p>
                                                    <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>
                                                    {subscriber.status}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(subscriber.subscribed).toLocaleDateString()}
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
                                {mockCampaigns.map((campaign) => (
                                    <div key={campaign.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div>
                                            <p className="font-medium">{campaign.subject}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {campaign.sent ? `Sent on ${new Date(campaign.sent).toLocaleDateString()}` : "Not sent yet"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            {campaign.status === "sent" ? (
                                                <>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">{campaign.recipients}</p>
                                                        <p className="text-xs text-muted-foreground">Sent</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">{campaign.opened}</p>
                                                        <p className="text-xs text-muted-foreground">Opened</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium">{campaign.clicked}</p>
                                                        <p className="text-xs text-muted-foreground">Clicked</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <Badge variant="secondary">Draft</Badge>
                                            )}
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
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
                                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, enabled: checked }))}
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
                                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, doubleOptIn: checked }))}
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
                                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, welcomeEmail: checked }))}
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
                                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, newPostNotification: checked }))}
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
                                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
