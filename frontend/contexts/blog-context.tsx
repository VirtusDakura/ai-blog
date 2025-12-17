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

// Helper to get the full blog URL
export function getBlogUrl(subdomain: string, customDomain?: string) {
    if (customDomain) {
        return `https://${customDomain}`
    }
    return `https://${subdomain}.ai-blog.vercel.app`
}
