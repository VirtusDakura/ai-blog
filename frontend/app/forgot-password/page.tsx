"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Loader2, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            setIsSubmitted(true)
        } catch {
            setIsSubmitted(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
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
                        <h1 className="text-4xl font-bold mb-4">Forgot Password?</h1>
                        <p className="text-lg text-white/80">No worries! Enter your email and we'll send you a reset link.</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <span>AI Blog</span>
                        </Link>
                    </div>

                    <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl shadow-violet-500/5 p-8">
                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                        <Mail className="h-8 w-8 text-violet-500" />
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
                                    <p className="text-muted-foreground mt-2">Enter your email to receive a reset link.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="pl-10 h-12 bg-background/50 border-border/50 focus:border-violet-500" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full h-12 text-base font-medium bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25" disabled={isLoading}>
                                        {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Sending...</> : <>Send Reset Link<ArrowRight className="ml-2 h-5 w-5" /></>}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                                <p className="text-muted-foreground mb-6">If an account exists for <span className="font-medium text-foreground">{email}</span>, you will receive a reset link.</p>
                                <Button variant="outline" onClick={() => { setIsSubmitted(false); setEmail(""); }} className="border-violet-500/30 hover:bg-violet-500/10">Try another email</Button>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-border/50">
                            <Link href="/login">
                                <Button variant="ghost" className="w-full h-12 text-base font-medium hover:bg-violet-500/10">
                                    <ArrowLeft className="mr-2 h-5 w-5" />Back to Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
