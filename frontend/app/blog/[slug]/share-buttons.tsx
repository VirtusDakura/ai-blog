"use client"

import { Twitter, Facebook, Linkedin, Copy } from "lucide-react"

interface ShareButtonsProps {
    title: string
}

function ShareButton({ icon: Icon, label, onClick }: { icon: typeof Twitter; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-2.5 rounded-xl border border-border/50 hover:bg-muted hover:border-border transition-all"
            aria-label={label}
        >
            <Icon className="h-4 w-4 text-muted-foreground" />
        </button>
    )
}

export function ShareButtons({ title }: ShareButtonsProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

    return (
        <div className="flex items-center gap-2">
            <ShareButton
                icon={Twitter}
                label="Share on Twitter"
                onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
                }}
            />
            <ShareButton
                icon={Facebook}
                label="Share on Facebook"
                onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
                }}
            />
            <ShareButton
                icon={Linkedin}
                label="Share on LinkedIn"
                onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
                }}
            />
            <ShareButton
                icon={Copy}
                label="Copy link"
                onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                }}
            />
        </div>
    )
}
