import NextAuth, { AuthOptions, User } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

// Extend the User type to include role
interface ExtendedUser extends User {
    role?: string;
}

// Configure providers only if credentials are available
const providers = [];

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    );
}

// GitHub OAuth
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        })
    );
}

// Credentials provider (always available)
providers.push(
    CredentialsProvider({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials): Promise<ExtendedUser | null> {
            if (!credentials?.email || !credentials?.password) {
                throw new Error('Email and password are required');
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
            });

            if (!user || !user.password) {
                throw new Error('Invalid credentials');
            }

            const isCorrectPassword = await bcrypt.compare(
                credentials.password,
                user.password
            );

            if (!isCorrectPassword) {
                throw new Error('Invalid credentials');
            }

            return {
                id: user.id,
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
                role: user.role,
            };
        }
    })
);

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as ExtendedUser).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
