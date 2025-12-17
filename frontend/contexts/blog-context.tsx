"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface BlogData {
    blogName: string
    blogDescription?: string
    subdomain: string
    customDomain?: string
    category?: string
    theme: string
    colorScheme: string
    displayName?: string
    bio?: string
    profileImage?: string
    timezone?: string
    language?: string
    hasCompletedOnboarding: boolean
    isLoading: boolean
    error?: string
    refetch: () => void
}

const defaultBlogData: BlogData = {
    blogName: 'My Blog',
    subdomain: 'my-blog',
    theme: 'minimal',
    colorScheme: 'violet',
    hasCompletedOnboarding: false,
    isLoading: true,
    refetch: () => { },
}

const BlogContext = createContext<BlogData>(defaultBlogData)

export function BlogProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()
    const [blogData, setBlogData] = useState<Omit<BlogData, 'refetch'>>({
        ...defaultBlogData,
        isLoading: true,
    })

    const fetchBlogData = async () => {
        if (status === 'loading') return
        if (status === 'unauthenticated') {
            setBlogData(prev => ({ ...prev, isLoading: false }))
            return
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            const res = await fetch(`${API_URL}/blog/settings`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (res.ok) {
                const data = await res.json()
                // Only update if we have actual data from the API
                if (data && (data.blogName || data.subdomain)) {
                    setBlogData({
                        blogName: data.blogName || 'My Blog',
                        blogDescription: data.blogDescription,
                        subdomain: data.subdomain || 'my-blog',
                        customDomain: data.customDomain,
                        category: data.category,
                        theme: data.theme || 'minimal',
                        colorScheme: data.colorScheme || 'violet',
                        displayName: data.displayName,
                        bio: data.bio,
                        profileImage: data.profileImage,
                        timezone: data.timezone,
                        language: data.language,
                        hasCompletedOnboarding: data.hasCompletedOnboarding || false,
                        isLoading: false,
                    })
                } else {
                    // No blog data yet - user needs to complete onboarding
                    setBlogData(prev => ({
                        ...prev,
                        isLoading: false,
                        hasCompletedOnboarding: false,
                    }))
                }
            } else {
                // API call failed - use defaults
                setBlogData(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to fetch blog data',
                }))
            }
        } catch (error) {
            console.error('Error fetching blog data:', error)
            setBlogData(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to fetch blog data',
            }))
        }
    }

    useEffect(() => {
        fetchBlogData()
    }, [status])

    return (
        <BlogContext.Provider value={{ ...blogData, refetch: fetchBlogData }}>
            {children}
        </BlogContext.Provider>
    )
}

export function useBlog() {
    return useContext(BlogContext)
}

// Helper to get the blog URL - uses local /blog route during development
// In production with proper subdomain config, this would use the subdomain
export function getBlogUrl(subdomain: string, customDomain?: string): string {
    // If custom domain is set, use it
    if (customDomain) {
        return `https://${customDomain}`
    }

    // In development or when subdomains aren't configured, link to local /blog page
    // This ensures the link is always functional
    if (typeof window !== 'undefined') {
        const baseUrl = window.location.origin
        return `${baseUrl}/blog`
    }

    // Fallback for SSR
    return '/blog'
}

// Get display domain text (for UI display purposes)
export function getDisplayDomain(subdomain: string, customDomain?: string): string {
    if (customDomain) {
        return customDomain
    }
    // Show what the subdomain would be when deployed
    return `${subdomain}.ai-blog.vercel.app`
}
