// Extended session type for next-auth with custom properties
// This is used throughout the app for accessing custom session properties

export interface ExtendedSession {
    accessToken?: string;
    user?: {
        id?: string;
        blogId?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

// Helper type guard to safely extract token from session
export function getAccessToken(session: unknown): string | undefined {
    if (
        session &&
        typeof session === 'object' &&
        'accessToken' in session &&
        typeof (session as { accessToken?: unknown }).accessToken === 'string'
    ) {
        return (session as { accessToken: string }).accessToken;
    }
    return undefined;
}

// Helper to get user ID from session
export function getUserId(session: unknown): string | undefined {
    if (
        session &&
        typeof session === 'object' &&
        'user' in session &&
        session.user &&
        typeof session.user === 'object' &&
        'id' in session.user &&
        typeof (session.user as { id?: unknown }).id === 'string'
    ) {
        return (session.user as { id: string }).id;
    }
    return undefined;
}
