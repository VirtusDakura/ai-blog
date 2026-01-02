/* eslint-disable @typescript-eslint/no-explicit-any -- Session type casting is needed for next-auth custom properties */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Hook to get the current token - using callback to always get fresh value
function useGetToken() {
    const { data: session, status } = useSession();
    
    const getToken = useCallback(() => {
        if (status === 'loading') return undefined;
        return (session as any)?.accessToken as string | undefined;
    }, [session, status]);
    
    return { getToken, isLoading: status === 'loading', isAuthenticated: status === 'authenticated' };
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string[];
    authorId: string;
    author?: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        avatarUrl?: string | null;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PostsResponse {
    data: Post[];
    meta: {
        total: number;
        skip: number;
        take: number;
        hasMore: boolean;
    };
}

export interface CreatePostInput {
    title: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    authorId?: string;
}

export type UpdatePostInput = Partial<CreatePostInput>;

export interface GeneratePostInput {
    topic: string;
    outline?: string;
}

export interface GeneratePostResponse {
    content: string;
}

export interface SeoMetadata {
    title: string;
    description: string;
    keywords: string[];
}

// Custom fetch wrapper with error handling
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

// Helper to create authenticated fetch
async function fetchWithAuth<T>(endpoint: string, token: string | undefined, options: RequestInit = {}): Promise<T> {
    return fetchAPI<T>(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

// Cache configuration
const CACHE_TIME = {
    posts: 5 * 60 * 1000, // 5 minutes
    post: 2 * 60 * 1000,  // 2 minutes
};

// ==================== POST HOOKS ====================

// Hook to fetch all posts with pagination
export function usePosts(options?: { skip?: number; take?: number; published?: boolean }) {
    const { skip = 0, take = 10, published } = options || {};
    const queryParams = new URLSearchParams();
    queryParams.set('skip', skip.toString());
    queryParams.set('take', take.toString());
    if (published !== undefined) {
        queryParams.set('published', published.toString());
    }

    return useQuery({
        queryKey: ['posts', { skip, take, published }],
        queryFn: () => fetchAPI<PostsResponse>(`/posts?${queryParams.toString()}`),
        staleTime: CACHE_TIME.posts,
        gcTime: CACHE_TIME.posts * 2,
    });
}

// Hook to fetch a single post by ID
export function usePost(id: string) {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: () => fetchAPI<Post>(`/posts/${id}`),
        enabled: !!id,
        staleTime: CACHE_TIME.post,
        gcTime: CACHE_TIME.post * 2,
    });
}

// Hook to fetch a post by slug
export function usePostBySlug(slug: string) {
    return useQuery({
        queryKey: ['posts', 'slug', slug],
        queryFn: () => fetchAPI<Post>(`/posts/slug/${slug}`),
        enabled: !!slug,
        staleTime: CACHE_TIME.post,
    });
}

// Hook to create a post
export function useCreatePost() {
    const queryClient = useQueryClient();
    const { getToken, isAuthenticated } = useGetToken();

    return useMutation({
        mutationFn: async (data: CreatePostInput) => {
            const token = getToken();
            if (!token) {
                console.error('useCreatePost: No token available. isAuthenticated:', isAuthenticated);
                throw new Error('Not authenticated. Please log in again.');
            }
            console.log('useCreatePost: Sending request with token');
            return fetchWithAuth<Post>('/posts', token, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// Hook to update a post
export function useUpdatePost() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) => {
            const token = getToken();
            if (!token) {
                return Promise.reject(new Error('Not authenticated. Please log in.'));
            }
            return fetchWithAuth<Post>(`/posts/${id}`, token, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to publish a post
export function usePublishPost() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (id: string) => {
            const token = getToken();
            if (!token) {
                return Promise.reject(new Error('Not authenticated. Please log in.'));
            }
            return fetchWithAuth<Post>(`/posts/${id}/publish`, token, {
                method: 'POST',
            });
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to unpublish a post
export function useUnpublishPost() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (id: string) => {
            const token = getToken();
            if (!token) {
                return Promise.reject(new Error('Not authenticated. Please log in.'));
            }
            return fetchWithAuth<Post>(`/posts/${id}/unpublish`, token, {
                method: 'POST',
            });
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to delete a post
export function useDeletePost() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (id: string) => {
            const token = getToken();
            if (!token) {
                return Promise.reject(new Error('Not authenticated. Please log in.'));
            }
            return fetchWithAuth<void>(`/posts/${id}`, token, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// ==================== AI HOOKS ====================

// Hook to generate post content with AI
export function useGeneratePost() {
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (data: GeneratePostInput) => {
            const token = getToken();
            return fetchWithAuth<GeneratePostResponse>('/ai/generate', token, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    });
}

// Hook to generate SEO metadata
export function useGenerateSeo() {
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (content: string) => {
            const token = getToken();
            return fetchWithAuth<SeoMetadata>('/ai/seo', token, {
                method: 'POST',
                body: JSON.stringify({ content }),
            });
        },
    });
}

// Hook to generate tags
export function useGenerateTags() {
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (content: string) => {
            const token = getToken();
            return fetchWithAuth<{ tags: string[] }>('/ai/tags', token, {
                method: 'POST',
                body: JSON.stringify({ content }),
            });
        },
    });
}

// Hook to queue AI article generation
export function useQueueArticleGeneration() {
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (data: GeneratePostInput) => {
            const token = getToken();
            return fetchWithAuth<{ jobId: string; queue: string }>('/ai/queue/generate', token, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    });
}

// Hook to check job status
export function useJobStatus(queue: string, jobId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useQuery({
        queryKey: ['jobs', queue, jobId],
        queryFn: () => fetchAPI<{ id: string; state: string; result: any; progress: number }>(`/ai/queue/${queue}/${jobId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }),
        enabled: !!queue && !!jobId && !!token,
        refetchInterval: (query) => {
            const state = query.state.data?.state;
            // Stop polling once job is completed or failed
            if (state === 'completed' || state === 'failed') {
                return false;
            }
            return 2000; // Poll every 2 seconds while job is running
        },
    });
}

// Composite hook for easy AI access
export function useAI() {
    const generatePost = useGeneratePost();
    const generateSeo = useGenerateSeo();
    const generateTags = useGenerateTags();

    return {
        generateArticle: generatePost,
        generatePost,
        generateSeo,
        generateTags,
        isLoading: generatePost.isPending || generateSeo.isPending || generateTags.isPending,
    };
}

// ==================== COMMENT TYPES & HOOKS ====================

export interface Comment {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    parentId: string | null;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
    };
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface CommentsResponse {
    data: Comment[];
    meta: {
        total: number;
        skip: number;
        take: number;
        hasMore: boolean;
    };
}

export interface CreateCommentInput {
    id?: string;
    content: string;
    postId: string;
    parentId?: string;
    authorId?: string;
}

// Hook to fetch comments for a post
export function useComments(postId: string) {
    // Comments for display are public, so no auth needed (or optional)
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: () => fetchAPI<CommentsResponse>(`/comments/post/${postId}`),
        enabled: !!postId,
        staleTime: 60 * 1000, // 1 minute
    });
}

// Hook to create a comment
export function useCreateComment() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: (data: CreateCommentInput) => {
            const token = getToken();
            return fetchWithAuth<Comment>('/comments', token, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
        },
    });
}

// Hook to update a comment
export function useUpdateComment() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: ({ id, content }: { id: string; content: string; postId: string }) => {
            const token = getToken();
            return fetchWithAuth<Comment>(`/comments/${id}`, token, {
                method: 'PATCH',
                body: JSON.stringify({ content }),
            });
        },
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}

// Hook to delete a comment
export function useDeleteComment() {
    const queryClient = useQueryClient();
    const { getToken } = useGetToken();

    return useMutation({
        mutationFn: ({ id }: { id: string; postId: string }) => {
            const token = getToken();
            return fetchWithAuth<void>(`/comments/${id}`, token, {
                method: 'DELETE',
            });
        },
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}
