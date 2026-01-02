"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    BookOpen, ArrowRight, ArrowLeft, Check, Sparkles, Globe, Palette, User,
    Rocket, PenTool, Layout, Sun, Moon, Zap, Image, Clock, Tag, Languages,
    CheckCircle2, Edit3, RefreshCw, Copy, ExternalLink
} from "lucide-react"

// Step definitions
const STEPS = [
    { id: 1, title: "Welcome", icon: Sparkles },
    { id: 2, title: "Blog Details", icon: PenTool },
    { id: 3, title: "Domain", icon: Globe },
    { id: 4, title: "Category", icon: Tag },
    { id: 5, title: "Appearance", icon: Palette },
    { id: 6, title: "Profile", icon: User },
    { id: 7, title: "Launch", icon: Rocket },
]

// Blog categories
const CATEGORIES = [
    { id: "tech", label: "Technology", icon: "💻", color: "from-blue-500 to-cyan-500" },
    { id: "lifestyle", label: "Lifestyle", icon: "🌟", color: "from-pink-500 to-rose-500" },
    { id: "business", label: "Business", icon: "💼", color: "from-amber-500 to-orange-500" },
    { id: "travel", label: "Travel", icon: "✈️", color: "from-green-500 to-emerald-500" },
    { id: "food", label: "Food & Recipes", icon: "🍳", color: "from-red-500 to-pink-500" },
    { id: "health", label: "Health & Fitness", icon: "💪", color: "from-teal-500 to-cyan-500" },
    { id: "finance", label: "Finance", icon: "📈", color: "from-violet-500 to-purple-500" },
    { id: "education", label: "Education", icon: "📚", color: "from-indigo-500 to-blue-500" },
    { id: "creative", label: "Creative Arts", icon: "🎨", color: "from-fuchsia-500 to-pink-500" },
    { id: "personal", label: "Personal", icon: "✍️", color: "from-slate-500 to-gray-600" },
]

// Theme options
const THEMES = [
    { id: "minimal", label: "Minimal", preview: "bg-white dark:bg-zinc-900", accent: "violet" },
    { id: "modern", label: "Modern", preview: "bg-linear-to-br from-slate-50 to-slate-100", accent: "blue" },
    { id: "bold", label: "Bold", preview: "bg-linear-to-br from-violet-600 to-purple-700", accent: "white" },
    { id: "elegant", label: "Elegant", preview: "bg-linear-to-br from-amber-50 to-orange-50", accent: "amber" },
]

// Color schemes
const COLOR_SCHEMES = [
    { id: "violet", color: "bg-violet-500", label: "Violet" },
    { id: "blue", color: "bg-blue-500", label: "Blue" },
    { id: "emerald", color: "bg-emerald-500", label: "Emerald" },
    { id: "rose", color: "bg-rose-500", label: "Rose" },
    { id: "amber", color: "bg-amber-500", label: "Amber" },
    { id: "cyan", color: "bg-cyan-500", label: "Cyan" },
]

export default function OnboardingPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null)
    const [isEditingDomain, setIsEditingDomain] = useState(false)

    // Form data
    const [formData, setFormData] = useState({
        blogName: "",
        blogDescription: "",
        subdomain: "",
        customDomain: "",
        useCustomDomain: false,
        category: "",
        theme: "minimal",
        colorScheme: "violet",
        displayName: "",
        bio: "",
        profileImage: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: "en",
    })

    // Generate subdomain from blog name
    const generateSubdomain = useCallback((name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 30)
    }, [])

    // Auto-generate subdomain when blog name changes
    useEffect(() => {
        if (formData.blogName && !isEditingDomain) {
            const subdomain = generateSubdomain(formData.blogName)
            setFormData(prev => ({ ...prev, subdomain }))
            setDomainAvailable(null)
        }
    }, [formData.blogName, generateSubdomain, isEditingDomain])

    // Check domain availability (simulated)
    const checkDomainAvailability = async () => {
        if (!formData.subdomain) return
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        // For demo, randomly available or check against reserved words
        const reserved = ["admin", "api", "www", "blog", "app", "dashboard"]
        setDomainAvailable(!reserved.includes(formData.subdomain.toLowerCase()))
        setIsLoading(false)
    }

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleComplete = async () => {
        setIsLoading(true)
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

            // Get userId from session
            const userId = (session?.user as any)?.id

            if (!userId) {
                console.error("No user ID found in session")
                throw new Error("User not authenticated")
            }

            // Save blog settings and mark onboarding as completed
            const res = await fetch(`${API_URL}/blog/setup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    userId, // Pass userId explicitly
                    onboardingCompleted: true,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                console.error("API Error:", errorData)
                throw new Error(errorData.message || "Failed to save blog settings")
            }

            router.push("/dashboard?welcome=true")
            router.refresh()
        } catch (error) {
            console.error("Onboarding error:", error)
            // Even if API fails, redirect to dashboard
            // The user can complete setup later
            router.push("/dashboard")
        } finally {
            setIsLoading(false)
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1: return true
            case 2: return formData.blogName.length >= 3
            case 3: return formData.subdomain.length >= 3 && domainAvailable === true
            case 4: return formData.category !== ""
            case 5: return true
            case 6: return formData.displayName.length >= 2
            case 7: return true
            default: return false
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <WelcomeStep />
            case 2:
                return <BlogDetailsStep formData={formData} setFormData={setFormData} />
            case 3:
                return (
                    <DomainStep
                        formData={formData}
                        setFormData={setFormData}
                        domainAvailable={domainAvailable}
                        setDomainAvailable={setDomainAvailable}
                        isEditingDomain={isEditingDomain}
                        setIsEditingDomain={setIsEditingDomain}
                        checkDomainAvailability={checkDomainAvailability}
                        isLoading={isLoading}
                        generateSubdomain={generateSubdomain}
                    />
                )
            case 4:
                return <CategoryStep formData={formData} setFormData={setFormData} />
            case 5:
                return <AppearanceStep formData={formData} setFormData={setFormData} />
            case 6:
                return <ProfileStep formData={formData} setFormData={setFormData} />
            case 7:
                return <LaunchStep formData={formData} />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-purple-500/5" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl">AI Blog</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Step {currentStep} of {STEPS.length}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-start justify-between max-w-3xl mx-auto">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-start flex-1 last:flex-initial">
                                {/* Step Circle and Label */}
                                <div className="flex flex-col items-center relative">
                                    <div className={`
                                        relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                                        ${currentStep > step.id
                                            ? "bg-linear-to-br from-violet-500 to-purple-600 border-violet-500"
                                            : currentStep === step.id
                                                ? "border-violet-500 bg-violet-500/10"
                                                : "border-border bg-background"
                                        }
                                    `}>
                                        {currentStep > step.id ? (
                                            <Check className="h-5 w-5 text-white" />
                                        ) : (
                                            <step.icon className={`h-5 w-5 ${currentStep === step.id ? "text-violet-500" : "text-muted-foreground"}`} />
                                        )}
                                    </div>
                                    {/* Step Title - directly under its icon */}
                                    <span className={`text-xs mt-2 hidden md:block text-center w-16 ${currentStep === step.id ? "text-violet-500 font-medium" : "text-muted-foreground"}`}>
                                        {step.title}
                                    </span>
                                </div>
                                {/* Connector Line */}
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`flex-1 h-0.5 mt-5 mx-2 ${currentStep > step.id ? "bg-violet-500" : "bg-border"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>

                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="gap-2 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                            >
                                Continue <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="gap-2 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                            >
                                {isLoading ? (
                                    <>Launching...</>
                                ) : (
                                    <>Launch My Blog <Rocket className="h-4 w-4" /></>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Step 1: Welcome
function WelcomeStep() {
    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 mb-6">
                <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to AI Blog! 🎉</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
                Let's set up your blog in just a few minutes. We'll guide you through everything you need to start publishing amazing content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
                {[
                    { icon: Zap, label: "AI-Powered Writing" },
                    { icon: Layout, label: "Beautiful Themes" },
                    { icon: Globe, label: "Free Subdomain" },
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50">
                        <item.icon className="h-6 w-6 text-violet-500" />
                        <span className="text-sm font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Step 2: Blog Details
function BlogDetailsStep({ formData, setFormData }: { formData: any; setFormData: any }) {
    return (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 mb-4">
                    <PenTool className="h-7 w-7 text-violet-500" />
                </div>
                <h2 className="text-2xl font-bold">Name Your Blog</h2>
                <p className="text-muted-foreground mt-2">Choose a name and description that represents your content</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Blog Name *</label>
                    <Input
                        placeholder="e.g., Tech Insights, Foodie Adventures, Travel Tales"
                        value={formData.blogName}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, blogName: e.target.value }))}
                        className="h-12 text-lg"
                        maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">{formData.blogName.length}/50 characters</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Blog Description</label>
                    <Textarea
                        placeholder="Tell readers what your blog is about..."
                        value={formData.blogDescription}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, blogDescription: e.target.value }))}
                        rows={4}
                        maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">{formData.blogDescription.length}/200 characters</p>
                </div>
            </div>
        </div>
    )
}

// Step 3: Domain
function DomainStep({
    formData, setFormData, domainAvailable, setDomainAvailable,
    isEditingDomain, setIsEditingDomain, checkDomainAvailability, isLoading, generateSubdomain
}: any) {
    const fullDomain = `${formData.subdomain}.ai-blog.vercel.app`

    return (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 mb-4">
                    <Globe className="h-7 w-7 text-violet-500" />
                </div>
                <h2 className="text-2xl font-bold">Choose Your Domain</h2>
                <p className="text-muted-foreground mt-2">Get a free subdomain or connect your own</p>
            </div>

            <div className="space-y-6">
                {/* Generated Domain */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Your Blog URL</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <div className="flex items-center h-14 px-4 rounded-xl bg-muted/50 border border-border">
                                <span className="text-muted-foreground">https://</span>
                                {isEditingDomain ? (
                                    <input
                                        type="text"
                                        value={formData.subdomain}
                                        onChange={(e) => {
                                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                                            setFormData((prev: any) => ({ ...prev, subdomain: value }))
                                            setDomainAvailable(null)
                                        }}
                                        className="flex-1 bg-transparent outline-none font-medium mx-1"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="font-medium text-violet-600 dark:text-violet-400 mx-1">
                                        {formData.subdomain || "your-blog"}
                                    </span>
                                )}
                                <span className="text-muted-foreground">.ai-blog.vercel.app</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14"
                            onClick={() => setIsEditingDomain(!isEditingDomain)}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Domain Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={checkDomainAvailability}
                            disabled={isLoading || !formData.subdomain}
                            className="gap-2"
                        >
                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Check Availability
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setFormData((prev: any) => ({ ...prev, subdomain: generateSubdomain(formData.blogName) }))
                                setDomainAvailable(null)
                                setIsEditingDomain(false)
                            }}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" /> Reset
                        </Button>
                    </div>

                    {/* Availability Status */}
                    {domainAvailable !== null && (
                        <div className={`flex items-center gap-2 p-3 rounded-lg ${domainAvailable ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                            {domainAvailable ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-medium">{fullDomain} is available!</span>
                                </>
                            ) : (
                                <>
                                    <span>❌</span>
                                    <span className="font-medium">This subdomain is not available. Try another one.</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Domain Preview Card */}
                <div className="p-4 rounded-xl bg-linear-to-br from-violet-500/5 to-purple-500/5 border border-violet-500/20">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Preview</span>
                        <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                            <Copy className="h-3 w-3" /> Copy URL
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-background border">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">https://{fullDomain}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                    </div>
                </div>

                {/* Custom Domain Option */}
                <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-medium">Have your own domain?</p>
                            <p className="text-sm text-muted-foreground">You can add a custom domain later in settings</p>
                        </div>
                        <Button variant="outline" size="sm" disabled className="gap-2">
                            <Globe className="h-4 w-4" /> Add Later
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Step 4: Category
function CategoryStep({ formData, setFormData }: any) {
    return (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 mb-4">
                    <Tag className="h-7 w-7 text-violet-500" />
                </div>
                <h2 className="text-2xl font-bold">What's Your Blog About?</h2>
                <p className="text-muted-foreground mt-2">Choose a category that best describes your content</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setFormData((prev: any) => ({ ...prev, category: category.id }))}
                        className={`
                            relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${formData.category === category.id
                                ? "border-violet-500 bg-violet-500/10"
                                : "border-border hover:border-violet-500/50 hover:bg-muted/50"
                            }
                        `}
                    >
                        {formData.category === category.id && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-5 w-5 text-violet-500" />
                            </div>
                        )}
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <p className="font-medium text-sm">{category.label}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

// Step 5: Appearance
function AppearanceStep({ formData, setFormData }: any) {
    return (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 mb-4">
                    <Palette className="h-7 w-7 text-violet-500" />
                </div>
                <h2 className="text-2xl font-bold">Customize Your Look</h2>
                <p className="text-muted-foreground mt-2">Choose a theme and color scheme for your blog</p>
            </div>

            <div className="space-y-8">
                {/* Theme Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Theme Style</label>
                    <div className="grid grid-cols-2 gap-3">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setFormData((prev: any) => ({ ...prev, theme: theme.id }))}
                                className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-200
                                    ${formData.theme === theme.id
                                        ? "border-violet-500"
                                        : "border-border hover:border-violet-500/50"
                                    }
                                `}
                            >
                                {formData.theme === theme.id && (
                                    <div className="absolute top-2 right-2">
                                        <CheckCircle2 className="h-5 w-5 text-violet-500" />
                                    </div>
                                )}
                                <div className={`h-16 rounded-lg mb-3 ${theme.preview}`} />
                                <p className="font-medium text-sm">{theme.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Accent Color</label>
                    <div className="flex gap-3 flex-wrap">
                        {COLOR_SCHEMES.map((scheme) => (
                            <button
                                key={scheme.id}
                                onClick={() => setFormData((prev: any) => ({ ...prev, colorScheme: scheme.id }))}
                                className={`
                                    relative w-12 h-12 rounded-xl ${scheme.color} transition-all duration-200
                                    ${formData.colorScheme === scheme.id
                                        ? "ring-2 ring-offset-2 ring-violet-500"
                                        : "hover:scale-110"
                                    }
                                `}
                                title={scheme.label}
                            >
                                {formData.colorScheme === scheme.id && (
                                    <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Step 6: Profile
function ProfileStep({ formData, setFormData }: any) {
    return (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 mb-4">
                    <User className="h-7 w-7 text-violet-500" />
                </div>
                <h2 className="text-2xl font-bold">Set Up Your Profile</h2>
                <p className="text-muted-foreground mt-2">Let readers know who you are</p>
            </div>

            <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {formData.displayName ? formData.displayName[0].toUpperCase() : "?"}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center hover:bg-muted transition-colors">
                            <Image className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name *</label>
                    <Input
                        placeholder="How should readers see you?"
                        value={formData.displayName}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, displayName: e.target.value }))}
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                        placeholder="Tell readers a bit about yourself..."
                        value={formData.bio}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">{formData.bio.length}/160 characters</p>
                </div>

                {/* Timezone & Language */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Timezone
                        </label>
                        <div className="h-10 px-3 rounded-md bg-muted/50 border flex items-center text-sm">
                            {formData.timezone}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Languages className="h-4 w-4" /> Language
                        </label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, language: e.target.value }))}
                            className="w-full h-10 px-3 rounded-md bg-muted/50 border text-sm"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="pt">Português</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Step 7: Launch
function LaunchStep({ formData }: any) {
    const fullDomain = `${formData.subdomain}.ai-blog.vercel.app`
    const category = CATEGORIES.find(c => c.id === formData.category)

    return (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 mb-6">
                    <Rocket className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Ready to Launch! 🚀</h2>
                <p className="text-muted-foreground">Here's a summary of your new blog</p>
            </div>

            <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid gap-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                            <PenTool className="h-5 w-5 text-violet-500" />
                            <span className="text-sm text-muted-foreground">Blog Name</span>
                        </div>
                        <span className="font-medium">{formData.blogName}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-violet-500" />
                            <span className="text-sm text-muted-foreground">Domain</span>
                        </div>
                        <span className="font-medium font-mono text-sm">{fullDomain}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{category?.icon}</span>
                            <span className="text-sm text-muted-foreground">Category</span>
                        </div>
                        <span className="font-medium">{category?.label}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-violet-500" />
                            <span className="text-sm text-muted-foreground">Author</span>
                        </div>
                        <span className="font-medium">{formData.displayName}</span>
                    </div>
                </div>

                {/* What's Next */}
                <div className="mt-6 p-4 rounded-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-500" /> What's Next?
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Write your first blog post with AI assistance
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Customize your blog's appearance
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Share your blog with the world
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
