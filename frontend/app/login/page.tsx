"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Loader2, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (searchParams.get("registered") === "true") {
            setSuccess("Account created successfully! Please sign in.")
        }
        if (searchParams.get("reset") === "true") {
            setSuccess("Password reset successfully! Please sign in with your new password.")
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
            } else {
                // Check if user has completed onboarding
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
                try {
                    const res = await fetch(`${API_URL}/blog/status`, {
                        credentials: 'include',
                    })
                    const data = await res.json()

                    if (data.hasCompletedOnboarding) {
                        router.push("/dashboard")
                    } else {
                        router.push("/onboarding")
                    }
                } catch {
                    // If check fails, default to dashboard (onboarding can handle redirects)
                    router.push("/dashboard")
                }
                router.refresh()
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700">
                {/* Animated Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md text-center">
                        <div className="flex justify-center mb-8">
                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <BookOpen className="h-12 w-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                        <p className="text-lg text-white/80 mb-8">
                            Sign in to continue creating amazing AI-powered blog content.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 text-left">
                            {[
                                "AI-powered content generation",
                                "Beautiful rich text editor",
                                "SEO optimization tools",
                                "Analytics dashboard"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/90">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <Sparkles className="w-3 h-3" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-purple-500/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span>AI Blog</span>
                        </Link>
                    </div>

                    {/* Form Card */}
                    <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl shadow-violet-500/5 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
                            <p className="text-muted-foreground mt-2">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-medium bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-3 text-muted-foreground">New to AI Blog?</span>
                            </div>
                        </div>

                        <Link href="/register">
                            <Button
                                variant="outline"
                                className="w-full h-12 text-base font-medium border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500/50 transition-all duration-300"
                            >
                                Create an Account
                            </Button>
                        </Link>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-8">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Loading fallback for Suspense
function LoginFormLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFormLoading />}>
            <LoginForm />
        </Suspense>
    )
}
