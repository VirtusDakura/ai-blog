"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    DollarSign, CreditCard, Gift, Coffee, Sparkles, TrendingUp,
    Lock, Check, ArrowUpRight, Users, Star, Zap
} from "lucide-react"

// Monetization methods
const monetizationMethods = [
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
        description: "Let readers buy you a virtual coffee",
        icon: Coffee,
        enabled: true,
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
]

// Mock earnings data
const earningsData = {
    thisMonth: 125.50,
    lastMonth: 98.25,
    total: 542.75,
    pendingPayout: 75.00,
}

// Mock supporters
const mockSupporters = [
    { id: 1, name: "John D.", amount: 5, message: "Great content!", date: "2024-12-16" },
    { id: 2, name: "Anonymous", amount: 10, message: "Keep up the good work!", date: "2024-12-14" },
    { id: 3, name: "Sarah M.", amount: 3, message: "", date: "2024-12-10" },
]

export default function MonetizationPage() {
    const [methods, setMethods] = useState(monetizationMethods)
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

    const toggleMethod = (id: string) => {
        setMethods(prev => prev.map(m =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
        ))
    }

    const growthPercent = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1)

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
                <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payout Settings
                </Button>
            </div>

            {/* Earnings Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold text-green-600">${earningsData.thisMonth}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4" />
                            <span>+{growthPercent}% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Last Month</p>
                                <p className="text-2xl font-bold">${earningsData.lastMonth}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Earned</p>
                                <p className="text-2xl font-bold">${earningsData.total}</p>
                            </div>
                            <Sparkles className="h-8 w-8 text-violet-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">${earningsData.pendingPayout}</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-orange-500" />
                        </div>
                        <Progress
                            value={(earningsData.pendingPayout / paymentSettings.minimumPayout) * 100}
                            className="mt-2 h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            ${paymentSettings.minimumPayout - earningsData.pendingPayout} until payout
                        </p>
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
                                                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Pro</Badge>
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
                                    {method.enabled && (
                                        <CardContent>
                                            <Button variant="outline" size="sm">
                                                Configure
                                            </Button>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })}
                    </div>

                    {/* Donation Widget Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Donation Widget</CardTitle>
                            <CardDescription>
                                Preview how your donation widget will appear
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-md mx-auto p-6 rounded-xl border bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                                <div className="text-center mb-4">
                                    <Coffee className="h-8 w-8 mx-auto mb-2 text-violet-500" />
                                    <p className="font-medium">{donationSettings.message}</p>
                                </div>
                                <div className="flex justify-center gap-2 mb-4">
                                    {donationSettings.suggestedAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            className="px-4 py-2 rounded-lg border hover:border-violet-500 hover:bg-violet-500/5 transition-colors"
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                    {donationSettings.customAmount && (
                                        <button className="px-4 py-2 rounded-lg border hover:border-violet-500 hover:bg-violet-500/5 transition-colors">
                                            Custom
                                        </button>
                                    )}
                                </div>
                                <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
                                    <Gift className="mr-2 h-4 w-4" />
                                    Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
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
                            {mockSupporters.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No supporters yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mockSupporters.map((supporter) => (
                                        <div key={supporter.id} className="flex items-center justify-between p-4 rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                    {supporter.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{supporter.name}</p>
                                                    {supporter.message && (
                                                        <p className="text-sm text-muted-foreground">"{supporter.message}"</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">${supporter.amount}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(supporter.date).toLocaleDateString()}
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
                                        <p className="text-sm text-muted-foreground">Accept card payments</p>
                                    </div>
                                </div>
                                {paymentSettings.stripeConnected ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Check className="h-4 w-4" />
                                        <span className="text-sm">Connected</span>
                                    </div>
                                ) : (
                                    <Button>Connect Stripe</Button>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>PayPal Email</Label>
                                <Input
                                    type="email"
                                    value={paymentSettings.paypalEmail}
                                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, paypalEmail: e.target.value }))}
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Minimum Payout Amount</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">$</span>
                                    <Input
                                        type="number"
                                        value={paymentSettings.minimumPayout}
                                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, minimumPayout: parseInt(e.target.value) }))}
                                        className="w-24"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    We'll send your payout when you reach this amount
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
