"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
    id: string
    title?: string
    description?: string
    variant?: "default" | "success" | "error" | "warning" | "destructive"
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, "id">) => void
    removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([])

    const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).slice(2, 9)
        const newToast = { ...toast, id }
        setToasts((prev) => [...prev, newToast])

        // Auto remove after duration
        const duration = toast.duration ?? 5000
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
    const variantStyles = {
        default: "bg-background border",
        success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
        destructive: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800", // Same as error for now
        warning: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    }

    const titleStyles = {
        default: "text-foreground",
        success: "text-green-800 dark:text-green-200",
        error: "text-red-800 dark:text-red-200",
        destructive: "text-red-800 dark:text-red-200",
        warning: "text-amber-800 dark:text-amber-200",
    }

    return (
        <div
            className={cn(
                "pointer-events-auto min-w-[300px] max-w-[400px] rounded-lg shadow-lg border p-4 animate-in slide-in-from-right-full duration-300",
                variantStyles[toast.variant || "default"]
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    {toast.title && (
                        <p className={cn("font-semibold text-sm", titleStyles[toast.variant || "default"])}>
                            {toast.title}
                        </p>
                    )}
                    {toast.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {toast.description}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

// Convenience functions
export function toast(options: Omit<Toast, "id">) {
    // This is a simple imperative toast
    // For a full solution, you'd need a singleton pattern
    console.log("Toast:", options)
}
