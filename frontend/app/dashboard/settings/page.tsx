"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Settings,
    User,
    Bell,
    Palette,
    Shield,
    Sparkles,
    Save,
    Loader2,
    Camera
} from "lucide-react"

export default function SettingsPage() {
    const { data: session } = useSession()
    const [isSaving, setIsSaving] = useState(false)

    // Profile Settings
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [bio, setBio] = useState("")

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [marketingEmails, setMarketingEmails] = useState(false)
    const [commentNotifications, setCommentNotifications] = useState(true)

    // AI Settings
    const [aiTone, setAiTone] = useState("professional")
    const [autoSeo, setAutoSeo] = useState(true)
    const [aiSuggestions, setAiSuggestions] = useState(true)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        alert("Settings saved successfully!")
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                    </CardTitle>
                    <CardDescription>
                        Your public profile information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={session?.user?.image || undefined} />
                                <AvatarFallback className="text-xl">
                                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <p className="font-medium">{session?.user?.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Name Fields */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell readers about yourself..."
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be displayed on your author profile page.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <CardDescription>
                        Configure how you receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive email updates about your posts
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Comment Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified when someone comments on your posts
                            </p>
                        </div>
                        <Switch
                            checked={commentNotifications}
                            onCheckedChange={setCommentNotifications}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive tips and product updates
                            </p>
                        </div>
                        <Switch
                            checked={marketingEmails}
                            onCheckedChange={setMarketingEmails}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* AI Settings */}
            <Card className="border-violet-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-violet-500" />
                        AI Preferences
                        <Badge variant="secondary" className="ml-2">Beta</Badge>
                    </CardTitle>
                    <CardDescription>
                        Customize your AI writing assistant
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Writing Tone</Label>
                        <div className="flex flex-wrap gap-2">
                            {["professional", "casual", "academic", "creative"].map((tone) => (
                                <Button
                                    key={tone}
                                    size="sm"
                                    variant={aiTone === tone ? "default" : "outline"}
                                    onClick={() => setAiTone(tone)}
                                    className="capitalize"
                                >
                                    {tone}
                                </Button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            This affects the style of AI-generated content
                        </p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto SEO Generation</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically generate SEO metadata when publishing
                            </p>
                        </div>
                        <Switch
                            checked={autoSeo}
                            onCheckedChange={setAutoSeo}
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>AI Writing Suggestions</Label>
                            <p className="text-sm text-muted-foreground">
                                Show AI suggestions while writing
                            </p>
                        </div>
                        <Switch
                            checked={aiSuggestions}
                            onCheckedChange={setAiSuggestions}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>
                        Manage your account security
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">
                                Update your account password
                            </p>
                        </div>
                        <Button variant="outline">Change</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security
                            </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-red-500">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="destructive">Delete</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
