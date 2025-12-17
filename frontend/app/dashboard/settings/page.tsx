"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useBlog } from "@/contexts/blog-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Settings, Globe, User, Shield, Bell, Trash2, Save, Check, AlertCircle,
    Mail, Lock, Eye, EyeOff, RefreshCw, Download, Upload, Code, Rss
} from "lucide-react"

export default function SettingsPage() {
    const { data: session } = useSession()
    const blog = useBlog()
    const [isLoading, setIsLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        blogName: "",
        blogDescription: "",
        subdomain: "",
        customDomain: "",
        language: "en",
        timezone: "",
    })

    // Profile Settings
    const [profileSettings, setProfileSettings] = useState({
        displayName: "",
        email: "",
        bio: "",
        avatarUrl: "",
    })

    // Privacy Settings
    const [privacySettings, setPrivacySettings] = useState({
        isPublic: true,
        allowComments: true,
        moderateComments: true,
        showAuthorBio: true,
        enableRss: true,
        allowIndexing: true,
    })

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailOnComment: true,
        emailOnSubscriber: true,
        emailDigest: "weekly",
        browserNotifications: false,
    })

    // Load settings from blog context
    useEffect(() => {
        if (!blog.isLoading && blog.blogName) {
            setGeneralSettings({
                blogName: blog.blogName || "",
                blogDescription: blog.blogDescription || "",
                subdomain: blog.subdomain || "",
                customDomain: blog.customDomain || "",
                language: blog.language || "en",
                timezone: blog.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
            setProfileSettings({
                displayName: blog.displayName || "",
                email: (session?.user?.email as string) || "",
                bio: blog.bio || "",
                avatarUrl: blog.profileImage || "",
            })
        }
    }, [blog, session])

    const handleSaveGeneral = async () => {
        setIsLoading(true)
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            const userId = (session?.user as any)?.id

            const res = await fetch(`${API_URL}/blog/setup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    ...generalSettings,
                    displayName: profileSettings.displayName,
                    bio: profileSettings.bio,
                    profileImage: profileSettings.avatarUrl,
                }),
            })

            if (res.ok) {
                setSaveSuccess(true)
                blog.refetch()
                setTimeout(() => setSaveSuccess(false), 3000)
            }
        } catch (error) {
            console.error("Failed to save settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (blog.isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your blog configuration and preferences
                    </p>
                </div>
                {saveSuccess && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Settings saved!</span>
                    </div>
                )}
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="general" className="gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Privacy</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2">
                        <Code className="h-4 w-4" />
                        <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Information</CardTitle>
                            <CardDescription>
                                Basic information about your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="blogName">Blog Name</Label>
                                    <Input
                                        id="blogName"
                                        value={generalSettings.blogName}
                                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, blogName: e.target.value }))}
                                        placeholder="My Awesome Blog"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subdomain">Subdomain</Label>
                                    <div className="flex">
                                        <Input
                                            id="subdomain"
                                            value={generalSettings.subdomain}
                                            onChange={(e) => setGeneralSettings(prev => ({ ...prev, subdomain: e.target.value }))}
                                            className="rounded-r-none"
                                        />
                                        <span className="flex items-center px-3 rounded-r-md border border-l-0 bg-muted text-sm text-muted-foreground">
                                            .ai-blog.vercel.app
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="blogDescription">Blog Description</Label>
                                <Textarea
                                    id="blogDescription"
                                    value={generalSettings.blogDescription}
                                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, blogDescription: e.target.value }))}
                                    placeholder="A brief description of your blog..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <select
                                        id="language"
                                        value={generalSettings.language}
                                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
                                        className="w-full h-10 px-3 rounded-md border bg-background"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="de">Deutsch</option>
                                        <option value="pt">Português</option>
                                        <option value="zh">中文</option>
                                        <option value="ja">日本語</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Input
                                        id="timezone"
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                        placeholder="America/New_York"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveGeneral} disabled={isLoading}>
                                {isLoading ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Domain</CardTitle>
                            <CardDescription>
                                Connect your own domain to your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customDomain">Domain Name</Label>
                                <Input
                                    id="customDomain"
                                    value={generalSettings.customDomain}
                                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, customDomain: e.target.value }))}
                                    placeholder="blog.yourdomain.com"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Point your domain's CNAME record to <code className="px-1 py-0.5 rounded bg-muted">cname.ai-blog.vercel.app</code>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Author Profile</CardTitle>
                            <CardDescription>
                                Your public author information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {profileSettings.displayName?.charAt(0) || "U"}
                                </div>
                                <div className="flex-1">
                                    <Button variant="outline" size="sm">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Photo
                                    </Button>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        JPG, PNG or GIF. Max 2MB.
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        value={profileSettings.displayName}
                                        onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileSettings.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={profileSettings.bio}
                                    onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Tell readers about yourself..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveGeneral} disabled={isLoading}>
                                {isLoading ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Profile
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your account password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" type="password" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline">
                                <Lock className="mr-2 h-4 w-4" />
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Privacy Settings */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Visibility</CardTitle>
                            <CardDescription>
                                Control who can see your blog
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Public Blog</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Make your blog visible to everyone
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.isPublic}
                                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, isPublic: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Search Engine Indexing</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow search engines to index your blog
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.allowIndexing}
                                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowIndexing: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Show Author Bio</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Display your bio on post pages
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.showAuthorBio}
                                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showAuthorBio: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Comments</CardTitle>
                            <CardDescription>
                                Manage comment settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Allow Comments</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Let readers comment on your posts
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.allowComments}
                                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowComments: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Moderate Comments</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Review comments before publishing
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.moderateComments}
                                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, moderateComments: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>RSS Feed</CardTitle>
                            <CardDescription>
                                RSS feed settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Enable RSS Feed</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow readers to subscribe via RSS
                                    </p>
                                </div>
                                <Switch
                                    checked={privacySettings.enableRss}
                                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, enableRss: checked }))}
                                />
                            </div>
                            {privacySettings.enableRss && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                    <Rss className="h-4 w-4 text-orange-500" />
                                    <code className="text-sm flex-1">{blog.subdomain}.ai-blog.vercel.app/rss.xml</code>
                                    <Button variant="ghost" size="sm">
                                        Copy
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Choose when to receive email notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>New Comments</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when someone comments
                                    </p>
                                </div>
                                <Switch
                                    checked={notificationSettings.emailOnComment}
                                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailOnComment: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>New Subscribers</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when someone subscribes
                                    </p>
                                </div>
                                <Switch
                                    checked={notificationSettings.emailOnSubscriber}
                                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailOnSubscriber: checked }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Digest</Label>
                                <select
                                    value={notificationSettings.emailDigest}
                                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailDigest: e.target.value }))}
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                >
                                    <option value="never">Never</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Export Data</CardTitle>
                            <CardDescription>
                                Download your blog data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Export all your posts, pages, comments, and settings as a JSON file.
                            </p>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export All Data
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Import Data</CardTitle>
                            <CardDescription>
                                Import content from other platforms
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Import posts from WordPress, Medium, or other blogging platforms.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import from WordPress
                                </Button>
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import from Medium
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-500/50">
                        <CardHeader>
                            <CardTitle className="text-red-500">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                                <div>
                                    <p className="font-medium">Delete Blog</p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your blog and all content
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Blog
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
