import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

// ==================== CATEGORIES & TAGS ====================

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    _count?: { posts: number };
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    _count?: { posts: number };
}

export function useCategories(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['categories', userId],
        queryFn: () => fetchAPI<Category[]>(`/categories?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId, // Categories are effectively public so might not strictly need token if endpoint is public
        // But for consistency we include it if available
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: { name: string; description?: string; color?: string; userId: string }) =>
            fetchAPI<Category>('/categories', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['categories', v.userId] }),
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, data, userId }: { id: string; data: Partial<Category>; userId: string }) =>
            fetchAPI<Category>(`/categories/${id}?userId=${userId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['categories', v.userId] }),
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, userId }: { id: string; userId: string }) =>
            fetchAPI<void>(`/categories/${id}?userId=${userId}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['categories', v.userId] }),
    });
}

export function useTags(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['tags', userId],
        queryFn: () => fetchAPI<Tag[]>(`/categories/tags?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId,
    });
}

export function useCreateTag() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: { name: string; userId: string }) =>
            fetchAPI<Tag>('/categories/tags', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['tags', v.userId] }),
    });
}

export function useDeleteTag() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, userId }: { id: string; userId: string }) =>
            fetchAPI<void>(`/categories/tags/${id}?userId=${userId}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['tags', v.userId] }),
    });
}


// ==================== PAGES ====================

export interface StaticPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: 'DRAFT' | 'PUBLISHED';
    order: number;
    isSystem: boolean;
    template: string;
    updatedAt: string;
}

export function usePages(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['pages', userId],
        queryFn: () => fetchAPI<StaticPage[]>(`/pages?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

export function useCreatePage() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: any & { userId: string }) =>
            fetchAPI<StaticPage>('/pages', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['pages', v.userId] }),
    });
}

export function useUpdatePage() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, data, userId }: { id: string; data: any; userId: string }) =>
            fetchAPI<StaticPage>(`/pages/${id}?userId=${userId}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['pages', v.userId] }),
    });
}

export function useDeletePage() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, userId }: { id: string; userId: string }) =>
            fetchAPI<void>(`/pages/${id}?userId=${userId}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['pages', v.userId] }),
    });
}

export function useReorderPages() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ items, userId }: { items: string[]; userId: string }) =>
            fetchAPI<void>('/pages/reorder', {
                method: 'POST',
                body: JSON.stringify({ items, userId }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['pages', v.userId] }),
    });
}


// ==================== SUBSCRIBERS ====================

export interface Subscriber {
    id: string;
    email: string;
    name?: string;
    status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
    createdAt: string;
}

export interface Campaign {
    id: string;
    subject: string;
    content: string;
    status: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
    sentAt?: string;
    recipientsCount: number;
    openedCount: number;
    clickedCount: number;
}

export function useSubscribers(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['subscribers', userId],
        queryFn: () => fetchAPI<Subscriber[]>(`/subscribers?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

export function useSubscriberStats(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['subscriber-stats', userId],
        queryFn: () => fetchAPI<{ total: number; active: number; growth: number }>(`/subscribers/stats?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

export function useCampaigns(userId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['campaigns', userId],
        queryFn: () => fetchAPI<Campaign[]>(`/subscribers/campaigns?userId=${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

export function useCreateCampaign() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: any & { userId: string }) =>
            fetchAPI<Campaign>('/subscribers/campaigns', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['campaigns', v.userId] }),
    });
}

export function useSendCampaign() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, userId }: { id: string; userId: string }) =>
            fetchAPI<void>(`/subscribers/campaigns/${id}/send?userId=${userId}`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['campaigns', v.userId] }),
    });
}


// ==================== COMMENTS MODERATION ====================

export interface CommentModeration {
    id: string;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
    author: string; // name
    email: string;
    postTitle: string;
    postSlug: string;
    createdAt: string;
}

export function useCommentsModeration(userId: string, status?: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    const params = new URLSearchParams();
    params.set('userId', userId);
    if (status && status !== 'ALL') params.set('status', status);

    return useQuery({
        queryKey: ['comments-moderation', userId, status],
        queryFn: () => fetchAPI<{ data: CommentModeration[]; meta: any }>(`/comments/moderate?${params.toString()}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!userId && !!token,
    });
}

export function useModerateComment() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, userId, action }: { id: string; userId: string; action: 'approve' | 'reject' | 'spam' }) =>
            fetchAPI<void>(`/comments/${id}/moderate`, {
                method: 'POST',
                body: JSON.stringify({ userId, action }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['comments-moderation', v.userId] }),
    });
}

export function useBulkModerateComments() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ ids, userId, action }: { ids: string[]; userId: string; action: 'approve' | 'reject' | 'spam' | 'delete' }) =>
            fetchAPI<void>('/comments/bulk-moderate', {
                method: 'POST',
                body: JSON.stringify({ ids, userId, action }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, v) => queryClient.invalidateQueries({ queryKey: ['comments-moderation', v.userId] }),
    });
}
