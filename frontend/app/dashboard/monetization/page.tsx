/* eslint-disable @typescript-eslint/no-explicit-any -- Session type casting */
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useBlogSettings, useUpdateBlogSettings, useDonations } from "@/hooks/use-blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
    DollarSign, CreditCard, Gift, Coffee, Sparkles, TrendingUp,
    Lock, Check, ArrowUpRight, Users, Star, RefreshCw
} from "lucide-react"

export default function MonetizationPage() {
    const { data: session } = useSession()
    const userId = (session?.user as any)?.id
    const { toast } = useToast()

    // Fetch data
    const { data: settings, isLoading: isLoadingSettings } = useBlogSettings(userId)
    const { data: donationData } = useDonations(userId)
    const updateSettings = useUpdateBlogSettings()

    // State
    const [methods, setMethods] = useState([
        {
            id: "donations",
            name: "Donations",
            description: "Accept one-time donations from readers",
            icon: Gift,
            enabled: false,
        },
        {
            id: "buy-me-coffee",
            name: "Buy Me a Coffee",
            description: "Let readers buy you a virtual coffee (coming soon)",
            icon: Coffee,
            enabled: false,
        },
        {
            id: "memberships",
            name: "Memberships",
            description: "Offer premium membership tiers",
            icon: Star,
            enabled: false,
            premium: true,
        },
        {
            id: "paid-posts",
            name: "Paid Posts",
            description: "Lock content behind a paywall",
            icon: Lock,
            enabled: false,
            premium: true,
        },
    ])

    const [paymentSettings, setPaymentSettings] = useState({
        stripeConnected: false,
        paypalEmail: "",
        minimumPayout: 50,
    })

    const [donationSettings, setDonationSettings] = useState({
        suggestedAmounts: [3, 5, 10],
        customAmount: true,
        message: "If you enjoy my content, consider supporting my work!",
    })

    // Sync settings from server to local state for form editing

    useEffect(() => {
        if (settings) {
            // Update methods enablement
            setMethods(prev => prev.map(m => {
                if (m.id === "donations") return { ...m, enabled: settings.donationsEnabled || false }
                return m
            }))

            // Update payment settings
            setPaymentSettings({
                stripeConnected: settings.stripeConnected || false,
                paypalEmail: settings.paypalEmail || "",
                minimumPayout: settings.minimumPayout || 50,
            })

            // Update donation settings
            setDonationSettings({
                suggestedAmounts: settings.suggestedAmounts ? settings.suggestedAmounts.split(',').map(Number) : [3, 5, 10],
                customAmount: true, // Assuming always true for now, add to backend if needed
                message: settings.donationMessage || "If you enjoy my content, consider supporting my work!",
            })
        }
    }, [settings])

    const handleSave = async () => {
        if (!userId) return

        try {
            await updateSettings.mutateAsync({
                userId,
                settings: {
                    donationsEnabled: methods.find(m => m.id === "donations")?.enabled,
                    paypalEmail: paymentSettings.paypalEmail,
                    minimumPayout: paymentSettings.minimumPayout,
                    donationMessage: donationSettings.message,
                    suggestedAmounts: donationSettings.suggestedAmounts.join(','),
                }
            })

            toast({
                title: "Settings saved",
                description: "Your monetization settings have been updated.",
            })
        } catch (error) {
            console.error("Failed to save monetization settings:", error)
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    const toggleMethod = (id: string) => {
        setMethods(prev => prev.map(m =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
        ))
    }

    // Use actual data or fallback
    const earnings = {
        total: donationData?.total || 0,
        pendingPayout: donationData?.total || 0, // Simplified for now
    }

    // Calculate growth (mock for now as we don't have historical data structure yet)
    // growthPercent will be used in future updates when historical data is available

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
                    <h1 className="text-3xl font-bold tracking-tight">Monetization</h1>
                    <p className="text-muted-foreground">
                        Earn money from your blog content
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payout Settings
                    </Button>
                    <Button onClick={handleSave} disabled={updateSettings.isPending}>
                        {updateSettings.isPending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Earnings Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-linear-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Donations</p>
                                <p className="text-2xl font-bold text-green-600">${earnings.total.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4" />
                            <span>{donationData?.count || 0} supporters</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold">$0.00</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Coming soon
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Payout</p>
                                <p className="text-2xl font-bold">${earnings.pendingPayout.toFixed(2)}</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-orange-500" />
                        </div>
                        <Progress
                            value={Math.min(100, (earnings.pendingPayout / paymentSettings.minimumPayout) * 100)}
                            className="mt-2 h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            ${Math.max(0, paymentSettings.minimumPayout - earnings.pendingPayout).toFixed(2)} until payout
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Methods</p>
                                <p className="text-2xl font-bold">
                                    {methods.filter(m => m.enabled).length}
                                </p>
                            </div>
                            <Sparkles className="h-8 w-8 text-violet-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="methods" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="methods" className="gap-2">
                        <DollarSign className="h-4 w-4" />
                        Methods
                    </TabsTrigger>
                    <TabsTrigger value="supporters" className="gap-2">
                        <Users className="h-4 w-4" />
                        Supporters
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Settings
                    </TabsTrigger>
                </TabsList>

                {/* Monetization Methods */}
                <TabsContent value="methods" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {methods.map((method) => {
                            const Icon = method.icon
                            return (
                                <Card key={method.id} className={method.enabled ? "border-violet-500/50" : ""}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${method.enabled ? "bg-violet-500/10" : "bg-muted"}`}>
                                                    <Icon className={`h-5 w-5 ${method.enabled ? "text-violet-500" : "text-muted-foreground"}`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="text-lg">{method.name}</CardTitle>
                                                        {method.premium && (
                                                            <Badge className="bg-linear-to-r from-amber-500 to-orange-500">Pro</Badge>
                                                        )}
                                                    </div>
                                                    <CardDescription>{method.description}</CardDescription>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={method.enabled}
                                                onCheckedChange={() => toggleMethod(method.id)}
                                                disabled={method.premium}
                                            />
                                        </div>
                                    </CardHeader>
                                    {method.enabled && method.id === 'donations' && (
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Button Message</Label>
                                                    <Input
                                                        value={donationSettings.message}
                                                        onChange={(e) => setDonationSettings(prev => ({ ...prev, message: e.target.value }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Suggested Amounts (comma separated)</Label>
                                                    <Input
                                                        value={donationSettings.suggestedAmounts.join(', ')}
                                                        onChange={(e) => {
                                                            const amounts = e.target.value.split(',').map(s => parseInt(s.trim()) || 0).filter(n => n > 0);
                                                            setDonationSettings(prev => ({ ...prev, suggestedAmounts: amounts.length ? amounts : [3, 5] }))
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })}
                    </div>

                    {/* Donation Widget Preview */}
                    {methods.find(m => m.id === "donations")?.enabled && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Donation Widget Preview</CardTitle>
                                <CardDescription>
                                    Preview how your donation widget will appear to visitors
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-w-md mx-auto p-6 rounded-xl border bg-linear-to-br from-violet-500/5 to-purple-500/5">
                                    <div className="text-center mb-4">
                                        <Coffee className="h-8 w-8 mx-auto mb-2 text-violet-500" />
                                        <p className="font-medium">{donationSettings.message}</p>
                                    </div>
                                    <div className="flex justify-center gap-2 mb-4">
                                        {donationSettings.suggestedAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                className="px-4 py-2 rounded-lg border hover:border-violet-500 hover:bg-violet-500/5 transition-colors bg-background"
                                            >
                                                ${amount}
                                            </button>
                                        ))}
                                        {donationSettings.customAmount && (
                                            <button className="px-4 py-2 rounded-lg border hover:border-violet-500 hover:bg-violet-500/5 transition-colors bg-background">
                                                Custom
                                            </button>
                                        )}
                                    </div>
                                    <Button className="w-full bg-linear-to-r from-violet-500 to-purple-600">
                                        <Gift className="mr-2 h-4 w-4" />
                                        Support
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Supporters */}
                <TabsContent value="supporters" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Supporters</CardTitle>
                            <CardDescription>
                                People who have supported your work
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!donationData?.donations || donationData.donations.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No supporters yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {donationData.donations.map((donation) => (
                                        <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                    {(donation.donorName || "A").charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{donation.donorName || "Anonymous"}</p>
                                                    {donation.message && (
                                                        <p className="text-sm text-muted-foreground">&ldquo;{donation.message}&rdquo;</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">${donation.amount}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(donation.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>
                                Connect your payment accounts to receive payouts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-violet-500/10">
                                        <CreditCard className="h-5 w-5 text-violet-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Stripe</p>
                                        <p className="text-sm text-muted-foreground">Accept card payments (Coming Soon)</p>
                                    </div>
                                </div>
                                <Button disabled variant="outline">Connect Stripe</Button>
                            </div>
                            <div className="space-y-2">
                                <Label>PayPal Email</Label>
                                <Input
                                    type="email"
                                    value={paymentSettings.paypalEmail}
                                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, paypalEmail: e.target.value }))}
                                    placeholder="your@email.com"
                                />
                                <p className="text-sm text-muted-foreground">
                                    We&apos;ll send payouts to this PayPal address
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Minimum Payout Amount</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        value={paymentSettings.minimumPayout}
                                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, minimumPayout: parseInt(e.target.value) || 0 }))}
                                        className="w-24"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    We&apos;ll send your payout when your balance reaches this amount
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
