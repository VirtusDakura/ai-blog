/* eslint-disable @typescript-eslint/no-explicit-any -- Session type casting is needed for next-auth custom properties */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- Types ---

export interface BlogSettings {
    blogName?: string;
    subdomain?: string;
    description?: string;
    customDomain?: string;
    category?: string;

    theme?: string;
    colorScheme?: string;
    font?: string;
    layout?: string;
    darkMode?: boolean;
    logoUrl?: string;
    faviconUrl?: string;
    customCss?: string;
    headerCode?: string;
    footerCode?: string;

    isPublic?: boolean;
    allowComments?: boolean;
    moderateComments?: boolean;
    showAuthorBio?: boolean;
    enableRss?: boolean;
    allowIndexing?: boolean;

    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
    twitterHandle?: string;
    facebookPage?: string;
    enableSitemap?: boolean;
    enableJsonLd?: boolean;
    canonicalUrl?: string;

    emailOnComment?: boolean;
    emailOnSubscriber?: boolean;
    emailDigest?: string;

    // Newsletter settings
    newsletterEnabled?: boolean;
    newsletterDoubleOptIn?: boolean;
    newsletterWelcomeEmail?: boolean;
    newsletterWeeklyDigest?: boolean;
    newsletterNewPostNotification?: boolean;

    // Monetization settings
    donationsEnabled?: boolean;
    donationMessage?: string;
    suggestedAmounts?: string;
    stripeConnected?: boolean;
    paypalEmail?: string;
    minimumPayout?: number;

    adsEnabled?: boolean;
    adsProvider?: string;
    adsPublisherId?: string;
    autoAds?: boolean;
    adsTxt?: string;
    adsTxtContent?: string;
    adPlacements?: string;
    adsenseId?: string;

    analyticsId?: string;
}

export interface BlogStatus {
    hasCompletedOnboarding: boolean;
    subdomain?: string;
    blogName?: string;
}

export interface Donation {
    id: string;
    amount: number;
    currency: string;
    message?: string;
    donorName?: string;
    donorEmail?: string;
    createdAt: string;
}

export interface Integration {
    id: string;
    name: string;
    enabled: boolean;
    settings: any;
}

// --- Fetch Wrapper ---

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'Network response was not ok');
    }

    return res.json();
}

// --- Hooks ---

export function useBlogSettings(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['blog-settings', userId],
        queryFn: () => fetchAPI<BlogSettings>(`/blog/settings?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateBlogSettings() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ userId, settings }: { userId: string; settings: BlogSettings }) =>
            fetchAPI<{ blog: BlogSettings }>('/blog/settings', {
                method: 'PUT',
                body: JSON.stringify({ userId, settings }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['blog-settings', variables.userId] });
            queryClient.setQueryData(['blog-settings', variables.userId], (old: BlogSettings) => ({
                ...old,
                ...data.blog,
            }));
        },
    });
}

export function useBlogStatus(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['blog-status', userId],
        queryFn: () => fetchAPI<BlogStatus>(`/blog/status?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

export function useCheckSubdomain() {
    // Check subdomain is public
    return useMutation({
        mutationFn: ({ subdomain, userId }: { subdomain: string; userId?: string }) =>
            fetchAPI<{ available: boolean }>(`/blog/check-subdomain?subdomain=${subdomain}${userId ? `&userId=${userId}` : ''}`),
    });
}

// Donations Hooks

export function useDonations(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['donations', userId],
        queryFn: () => fetchAPI<{ donations: Donation[]; total: number; count: number }>(`/blog/donations?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

// Integrations Hooks

export function useIntegrations(blogId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['integrations', blogId],
        queryFn: () => fetchAPI<Integration[]>(`/blog/integrations/${blogId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!blogId && !!token,
    });
}

export function useUpdateIntegration() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ blogId, name, enabled, settings }: { blogId: string; name: string; enabled?: boolean; settings?: any }) =>
            fetchAPI<Integration>(`/blog/integrations/${blogId}/${name}`, {
                method: 'PUT',
                body: JSON.stringify({ enabled, settings }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['integrations', variables.blogId] });
        },
    });
}
