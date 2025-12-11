import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        AI Blog Platform
      </h1>
      <p className="text-lg text-muted-foreground">
        A premium CMS built with Next.js, Shadcn, and Tiptap.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">
            Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
