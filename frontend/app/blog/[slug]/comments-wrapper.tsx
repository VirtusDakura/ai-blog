"use client"

import { CommentsSection } from "@/components/blog/comments-section"

interface CommentsWrapperProps {
    postId: string
}

export function CommentsWrapper({ postId }: CommentsWrapperProps) {
    return <CommentsSection postId={postId} />
}
