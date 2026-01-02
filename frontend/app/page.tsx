import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Shield,
  Globe,
  PenTool,
  BarChart,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description: "Generate high-quality blog posts, SEO metadata, and content ideas with advanced AI models.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10"
  },
  {
    icon: PenTool,
    title: "Rich Text Editor",
    description: "Beautiful TipTap-based editor with formatting tools, image support, and real-time AI assistance.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: Zap,
    title: "Instant Publishing",
    description: "Write, edit, and publish in seconds. SEO-optimized pages with beautiful responsive design.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    icon: Globe,
    title: "Public Blog Pages",
    description: "Beautiful public-facing blog with article pages, author profiles, and comments system.",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: BarChart,
    title: "Content Analytics",
    description: "Track your content performance with views, engagement metrics, and AI insights.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with NextAuth, rate limiting, and secure data handling.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="p-1.5 rounded-lg bg-linear-to-br from-violet-500 to-purple-600">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span>AI Blog</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Articles
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm" className="bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
              <Link href="/register">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-violet-600 dark:text-violet-400">Powered by Advanced AI</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Create Stunning
              </span>
              <br />
              <span className="bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Blog Content
              </span>
              <br />
              <span className="bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                with AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl">
              The all-in-one AI blogging platform. Write, edit, and publish beautiful content 10x faster with intelligent AI assistance.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-10 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25" asChild>
                <Link href="/dashboard">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                <Link href="/blog">
                  View Blog
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Get started in minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything You Need to
              <span className="bg-linear-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent"> Blog Like a Pro</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help you create, manage, and grow your blog with AI assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Transform Your Blogging?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators using AI to write better content, faster. Start your free account today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="h-14 px-10 text-lg bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700" asChild>
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg" asChild>
              <Link href="/blog">
                Explore Articles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-violet-500 to-purple-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">AI Blog Platform</span>
            </div>
            <nav className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link href="/blog" className="hover:text-foreground transition-colors">Articles</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Blog Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
