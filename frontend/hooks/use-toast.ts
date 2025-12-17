import { useToast as useToastContext } from "@/components/ui/toast"

export function useToast() {
    const context = useToastContext()
    return {
        toast: context.addToast,
        toasts: context.toasts,
        dismiss: context.removeToast,
    }
}
