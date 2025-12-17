import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

export interface UpdatePostInput extends Partial<CreatePostInput> { }

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
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: CreatePostInput) =>
            fetchAPI<Post>('/posts', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// Hook to update a post
export function useUpdatePost() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) =>
            fetchAPI<Post>(`/posts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to publish a post
export function usePublishPost() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (id: string) =>
            fetchAPI<Post>(`/posts/${id}/publish`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to unpublish a post
export function useUnpublishPost() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (id: string) =>
            fetchAPI<Post>(`/posts/${id}/unpublish`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to delete a post
export function useDeletePost() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (id: string) =>
            fetchAPI<void>(`/posts/${id}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// ==================== AI HOOKS ====================

// Hook to generate post content with AI
export function useGeneratePost() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: GeneratePostInput) =>
            fetchAPI<GeneratePostResponse>('/ai/generate', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
    });
}

// Hook to generate SEO metadata
export function useGenerateSeo() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (content: string) =>
            fetchAPI<SeoMetadata>('/ai/seo', {
                method: 'POST',
                body: JSON.stringify({ content }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
    });
}

// Hook to generate tags
export function useGenerateTags() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (content: string) =>
            fetchAPI<{ tags: string[] }>('/ai/tags', {
                method: 'POST',
                body: JSON.stringify({ content }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
    });
}

// Hook to queue AI article generation
export function useQueueArticleGeneration() {
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: GeneratePostInput) =>
            fetchAPI<{ jobId: string; queue: string }>('/ai/queue/generate', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
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
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: (data: CreateCommentInput) =>
            fetchAPI<Comment>('/comments', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
        },
    });
}

// Hook to update a comment
export function useUpdateComment() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, content, postId }: { id: string; content: string; postId: string }) =>
            fetchAPI<Comment>(`/comments/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ content }),
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}

// Hook to delete a comment
export function useDeleteComment() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;

    return useMutation({
        mutationFn: ({ id, postId }: { id: string; postId: string }) =>
            fetchAPI<void>(`/comments/${id}`, {
                method: 'DELETE',
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}
