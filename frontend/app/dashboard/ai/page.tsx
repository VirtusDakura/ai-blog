"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
    Sparkles,
    Lightbulb,
    RefreshCw,
    Expand,
    FileText,
    Loader2,
    Copy,
    Check,
    Wand2
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export default function AIToolsPage() {
    const { toast } = useToast()
    
    // Idea Generator State
    const [niche, setNiche] = useState("")
    const [ideas, setIdeas] = useState<string[]>([])
    const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false)

    // Rewrite State
    const [rewriteInput, setRewriteInput] = useState("")
    const [rewriteStyle, setRewriteStyle] = useState("")
    const [rewriteOutput, setRewriteOutput] = useState("")
    const [isRewriting, setIsRewriting] = useState(false)

    // Expand State
    const [expandInput, setExpandInput] = useState("")
    const [expandOutput, setExpandOutput] = useState("")
    const [isExpanding, setIsExpanding] = useState(false)

    // Summarize State
    const [summarizeInput, setSummarizeInput] = useState("")
    const [summarizeOutput, setSummarizeOutput] = useState("")
    const [isSummarizing, setIsSummarizing] = useState(false)

    // Copy State
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedId(id)
        toast({ title: "Copied!", description: "Content copied to clipboard", variant: "success" })
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleGenerateIdeas = async () => {
        setIsGeneratingIdeas(true)
        try {
            const res = await fetch(`${API_URL}/ai/ideas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche, count: 5 })
            })
            const data = await res.json()
            setIdeas(data.ideas || [])
            toast({ title: "Ideas generated!", description: "Check out your new blog ideas below", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Generation failed", description: "Failed to generate ideas. Please try again.", variant: "error" })
        } finally {
            setIsGeneratingIdeas(false)
        }
    }

    const handleRewrite = async () => {
        if (!rewriteInput.trim()) return
        setIsRewriting(true)
        try {
            const res = await fetch(`${API_URL}/ai/rewrite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: rewriteInput, style: rewriteStyle || undefined })
            })
            const data = await res.json()
            setRewriteOutput(data.content || "")
            toast({ title: "Content rewritten!", description: "Your content has been rewritten", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Rewrite failed", description: "Failed to rewrite content. Please try again.", variant: "error" })
        } finally {
            setIsRewriting(false)
        }
    }

    const handleExpand = async () => {
        if (!expandInput.trim()) return
        setIsExpanding(true)
        try {
            const res = await fetch(`${API_URL}/ai/expand`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: expandInput })
            })
            const data = await res.json()
            setExpandOutput(data.content || "")
            toast({ title: "Content expanded!", description: "Your content has been expanded", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Expansion failed", description: "Failed to expand content. Please try again.", variant: "error" })
        } finally {
            setIsExpanding(false)
        }
    }

    const handleSummarize = async () => {
        if (!summarizeInput.trim()) return
        setIsSummarizing(true)
        try {
            const res = await fetch(`${API_URL}/ai/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: summarizeInput })
            })
            const data = await res.json()
            setSummarizeOutput(data.summary || "")
            toast({ title: "Content summarized!", description: "Your content has been summarized", variant: "success" })
        } catch (error) {
            console.error(error)
            toast({ title: "Summarization failed", description: "Failed to summarize content. Please try again.", variant: "error" })
        } finally {
            setIsSummarizing(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-violet-500" />
                    AI Tools
                </h1>
                <p className="text-muted-foreground mt-2">
                    Powerful AI-powered tools to supercharge your content creation
                </p>
            </div>

            {/* Blog Idea Generator */}
            <Card className="border-violet-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Blog Idea Generator
                    </CardTitle>
                    <CardDescription>
                        Get creative blog post ideas based on your niche
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3">
                        <Input
                            placeholder="Enter your niche (e.g., 'Technology', 'Health', 'Marketing')"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleGenerateIdeas}
                            disabled={isGeneratingIdeas}
                            className="bg-linear-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                        >
                            {isGeneratingIdeas ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate Ideas
                                </>
                            )}
                        </Button>
                    </div>

                    {isGeneratingIdeas && (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    )}

                    {ideas.length > 0 && !isGeneratingIdeas && (
                        <div className="space-y-3">
                            {ideas.map((idea, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <Badge variant="outline" className="mb-2">Idea #{index + 1}</Badge>
                                            <p className="text-sm whitespace-pre-wrap">{idea}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => copyToClipboard(idea, `idea-${index}`)}
                                        >
                                            {copiedId === `idea-${index}` ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Rewrite Tool */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-blue-500" />
                            Content Rewriter
                        </CardTitle>
                        <CardDescription>
                            Rewrite content in a different style or improve clarity
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste content to rewrite..."
                            rows={4}
                            value={rewriteInput}
                            onChange={(e) => setRewriteInput(e.target.value)}
                        />
                        <Input
                            placeholder="Style (e.g., 'professional', 'casual', 'academic')"
                            value={rewriteStyle}
                            onChange={(e) => setRewriteStyle(e.target.value)}
                        />
                        <Button
                            onClick={handleRewrite}
                            disabled={isRewriting || !rewriteInput.trim()}
                            className="w-full"
                        >
                            {isRewriting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Rewrite
                        </Button>
                        {rewriteOutput && (
                            <div className="p-4 rounded-lg bg-muted border space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Result</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(rewriteOutput, "rewrite")}
                                    >
                                        {copiedId === "rewrite" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{rewriteOutput}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Expand Tool */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Expand className="h-5 w-5 text-green-500" />
                            Content Expander
                        </CardTitle>
                        <CardDescription>
                            Expand brief content with more details and examples
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste content to expand..."
                            rows={4}
                            value={expandInput}
                            onChange={(e) => setExpandInput(e.target.value)}
                        />
                        <Button
                            onClick={handleExpand}
                            disabled={isExpanding || !expandInput.trim()}
                            className="w-full"
                        >
                            {isExpanding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Expand className="mr-2 h-4 w-4" />}
                            Expand
                        </Button>
                        {expandOutput && (
                            <div className="p-4 rounded-lg bg-muted border space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-muted-foreground uppercase">Expanded</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(expandOutput, "expand")}
                                    >
                                        {copiedId === "expand" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{expandOutput}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Summarize Tool */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        Content Summarizer
                    </CardTitle>
                    <CardDescription>
                        Get a concise summary of long-form content
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Paste long content to summarize..."
                        rows={6}
                        value={summarizeInput}
                        onChange={(e) => setSummarizeInput(e.target.value)}
                    />
                    <Button
                        onClick={handleSummarize}
                        disabled={isSummarizing || !summarizeInput.trim()}
                    >
                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        Summarize
                    </Button>
                    {summarizeOutput && (
                        <div className="p-4 rounded-lg bg-linear-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Summary</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(summarizeOutput, "summarize")}
                                >
                                    {copiedId === "summarize" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-sm">{summarizeOutput}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
