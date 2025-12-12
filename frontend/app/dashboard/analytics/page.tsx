"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    Eye,
    TrendingUp,
    Users,
    FileText,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"

// Placeholder data - in production, this would come from an API
const stats = [
    {
        title: "Total Views",
        value: "12,543",
        change: "+12.5%",
        trend: "up",
        icon: Eye,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        title: "Unique Visitors",
        value: "3,287",
        change: "+8.2%",
        trend: "up",
        icon: Users,
        color: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        title: "Total Posts",
        value: "24",
        change: "+3",
        trend: "up",
        icon: FileText,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10"
    },
    {
        title: "Avg. Read Time",
        value: "4:32",
        change: "-0:15",
        trend: "down",
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
    }
]

const topPosts = [
    { title: "Getting Started with AI Writing", views: 2543, trend: "+15%" },
    { title: "10 Tips for Better Blog Content", views: 1876, trend: "+8%" },
    { title: "The Future of Content Creation", views: 1432, trend: "+22%" },
    { title: "SEO Best Practices in 2024", views: 1198, trend: "+5%" },
    { title: "How to Engage Your Readers", views: 987, trend: "+12%" },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-pink-500" />
                    Analytics
                </h1>
                <p className="text-muted-foreground mt-2">
                    Track your blog performance and audience engagement
                </p>
            </div>

            {/* Coming Soon Notice */}
            <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/20">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Coming Soon</Badge>
                        <Badge variant="outline">Preview</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Full analytics integration is coming soon. Below is a preview of the analytics dashboard with sample data.
                    </p>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className={`text-xs flex items-center gap-1 mt-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                )}
                                {stat.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Views Over Time</CardTitle>
                        <CardDescription>Daily page views for the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                            <div className="text-center text-muted-foreground">
                                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Chart visualization coming soon</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Posts</CardTitle>
                        <CardDescription>Your most viewed content this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPosts.map((post, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-muted-foreground w-5">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-medium truncate max-w-[200px]">
                                            {post.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-muted-foreground">{post.views.toLocaleString()} views</span>
                                        <span className="text-green-500 flex items-center gap-0.5">
                                            <TrendingUp className="h-3 w-3" />
                                            {post.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Traffic Sources */}
            <Card>
                <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-4 gap-4">
                        {[
                            { source: "Organic Search", percentage: 45, color: "bg-green-500" },
                            { source: "Social Media", percentage: 28, color: "bg-blue-500" },
                            { source: "Direct", percentage: 18, color: "bg-violet-500" },
                            { source: "Referral", percentage: 9, color: "bg-amber-500" },
                        ].map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{item.source}</span>
                                    <span className="text-muted-foreground">{item.percentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
