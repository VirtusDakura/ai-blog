import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Post {
    id: string;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostInput {
    title: string;
    content?: string;
    published?: boolean;
}

export interface GeneratePostInput {
    topic: string;
    outline?: string;
}

export interface GeneratePostResponse {
    content: string;
}

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

// Hook to fetch posts
export function usePosts() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: () => fetchAPI<Post[]>('/posts'),
    });
}

// Hook to fetch a single post
export function usePost(id: string) {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: () => fetchAPI<Post>(`/posts/${id}`),
        enabled: !!id,
    });
}

// Hook to create a draft
export function useCreateDraft() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostInput) =>
            fetchAPI<Post>('/posts', {
                method: 'POST',
                body: JSON.stringify({ ...data, published: false }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// Hook to publish a post
export function usePublishPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string }) =>
            fetchAPI<Post>(`/posts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ published: true }),
            }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
        },
    });
}

// Hook to trigger AI generation (Post)
export function useGeneratePost() {
    return useMutation({
        mutationFn: (data: GeneratePostInput) =>
            fetchAPI<GeneratePostResponse>('/ai/generate', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    });
}

export function useAI() {
    const generateArticle = useGeneratePost();
    return {
        generateArticle
    };
}
