import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-full gap-4">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">Dashboard Overview</h3>
                <p className="text-sm text-muted-foreground">
                    Welcome to your AI Blog CMS.
                </p>
            </div>
            <Button asChild>
                <Link href="/dashboard/posts/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Post
                </Link>
            </Button>
        </div>
    )
}
