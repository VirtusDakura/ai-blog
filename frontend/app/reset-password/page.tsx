"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Loader2, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const passwordStrength = {
        hasLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
    }
    const strengthScore = Object.values(passwordStrength).filter(Boolean).length

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            setIsLoading(false)
            return
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to reset password")
            setIsSuccess(true)
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
                <p className="text-muted-foreground mb-6">This password reset link is invalid or has expired.</p>
                <Link href="/forgot-password">
                    <Button className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">Request New Link</Button>
                </Link>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
                <p className="text-muted-foreground mb-6">Your password has been reset successfully.</p>
                <Link href="/login?reset=true">
                    <Button className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">Sign In<ArrowRight className="ml-2 h-5 w-5" /></Button>
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-violet-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">New Password</h2>
                <p className="text-muted-foreground mt-2">Enter your new password below.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />{error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-violet-500" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {password && (
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((level) => (
                                <div key={level} className={`h-1 flex-1 rounded-full ${strengthScore >= level ? (strengthScore <= 1 ? 'bg-red-500' : strengthScore === 2 ? 'bg-orange-500' : strengthScore === 3 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-border'}`} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-violet-500" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-500">Passwords do not match</p>}
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Resetting...</> : <>Reset Password<ArrowRight className="ml-2 h-5 w-5" /></>}
                </Button>
            </form>
        </>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex relative overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
                    <div className="max-w-md text-center">
                        <div className="flex justify-center mb-8">
                            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <BookOpen className="h-12 w-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Create New Password</h1>
                        <p className="text-lg text-white/80">Choose a strong password to secure your account.</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
                <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-purple-500/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-purple-600">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span>AI Blog</span>
                        </Link>
                    </div>

                    <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl shadow-violet-500/5 p-8">
                        <Suspense fallback={<div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>}>
                            <ResetPasswordForm />
                        </Suspense>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
