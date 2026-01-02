"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
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
    blogName: '',
    subdomain: '',
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

    const fetchBlogData = useCallback(async () => {
        if (status === 'loading') return
        if (status === 'unauthenticated') {
            setBlogData(prev => ({ ...prev, isLoading: false }))
            return
        }

        // Get userId from session
        const userId = (session?.user as { id?: string })?.id

        if (!userId) {
            console.log("No user ID in session, skipping blog fetch")
            setBlogData(prev => ({ ...prev, isLoading: false }))
            return
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            const token = (session as { accessToken?: string })?.accessToken

            // Pass userId as query parameter since we're not using cookie auth with backend
            const res = await fetch(`${API_URL}/blog/settings?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
            })

            if (res.ok) {
                const data = await res.json()

                // Only update if we have actual data from the API
                if (data) {
                    setBlogData({
                        blogName: data.blogName || '',
                        blogDescription: data.blogDescription || '',
                        subdomain: data.subdomain || '',
                        customDomain: data.customDomain || '',
                        category: data.category || '',
                        theme: data.theme || 'minimal',
                        colorScheme: data.colorScheme || 'violet',
                        displayName: data.displayName || '',
                        bio: data.bio || '',
                        profileImage: data.profileImage || '',
                        timezone: data.timezone || '',
                        language: data.language || '',
                        hasCompletedOnboarding: data.hasCompletedOnboarding || false,
                        isLoading: false,
                    })
                } else {
                    setBlogData(prev => ({
                        ...prev,
                        isLoading: false,
                        hasCompletedOnboarding: false,
                    }))
                }
            } else {
                console.error('Failed to fetch blog settings:', res.status, res.statusText)
                setBlogData(prev => ({
                    ...prev,
                    isLoading: false,
                    error: `Failed to fetch blog data: ${res.status}`,
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
    }, [status, session])

     
    useEffect(() => {
        if (status !== 'loading') {
            fetchBlogData()
        }
    }, [status, fetchBlogData])

    return (
        <BlogContext.Provider value={{ ...blogData, refetch: fetchBlogData }}>
            {children}
        </BlogContext.Provider>
    )
}

export function useBlog() {
    return useContext(BlogContext)
}

// Helper to get the blog URL - uses local /blog route
export function getBlogUrl(subdomain: string, customDomain?: string): string {
    if (customDomain) {
        return `https://${customDomain}`
    }

    // Link to local /blog page (fully functional)
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/blog`
    }

    return '/blog'
}

// Get display domain text (for UI display purposes)
export function getDisplayDomain(subdomain: string, customDomain?: string): string {
    if (customDomain) {
        return customDomain
    }
    if (subdomain) {
        return `${subdomain}.ai-blog.vercel.app`
    }
    return 'Not configured'
}
