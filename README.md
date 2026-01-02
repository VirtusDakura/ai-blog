# AI Blog Platform

A modern, AI-powered blogging platform with automated content generation, SEO optimization, and a rich text editor.

🔗 **Live Demo**: [Frontend](https://virtus-ai-blog.vercel.app) | [API](https://ai-blog-une3.onrender.com/api/health)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TailwindCSS 4, TipTap Editor |
| **Backend** | NestJS 11, Prisma 7, PostgreSQL |
| **AI** | Groq (LLaMA), HuggingFace (Embeddings, Summarization) |
| **Auth** | NextAuth.js (Credentials, OAuth) |
| **Queue** | BullMQ + Redis |
| **Storage** | Cloudinary |
| **Database** | Neon PostgreSQL |

---

## Features

- ✨ **AI Content Generation** — Generate blog posts from topics/outlines using Groq's LLaMA
- 🔍 **SEO Optimization** — Auto-generate titles, descriptions, and keywords
- 📝 **Rich Text Editor** — TipTap-based editor with image upload support
- 🔐 **Authentication** — Email/password + Google/GitHub OAuth
- 📊 **Dashboard** — Manage posts, drafts, and published content
- 🚀 **Background Jobs** — Async AI processing with BullMQ

---

## Project Structure

```
ai-blog/
├── frontend/          # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks (API, etc.)
│   └── prisma/        # Prisma schema (for NextAuth)
│
├── backend/           # NestJS API
│   ├── src/
│   │   ├── ai/        # AI generation services
│   │   ├── auth/      # Authentication
│   │   ├── posts/     # Blog posts CRUD
│   │   ├── users/     # User management
│   │   └── jobs/      # Background job processing
│   └── prisma/        # Database schema & migrations
│
└── render.yaml        # Render deployment config
```

---

## Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL (or Neon account)
- Redis (for BullMQ)

### 1. Clone & Install

```bash
git clone https://github.com/VirtusDakura/ai-blog.git
cd ai-blog

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Setup

**Frontend** (`frontend/.env`):
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # MUST match frontend secret!
GROQ_API_KEY=your-groq-key
HF_API_TOKEN=your-huggingface-token
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/posts` | List all posts |
| `POST` | `/api/posts` | Create a post |
| `GET` | `/api/posts/:id` | Get post by ID |
| `PATCH` | `/api/posts/:id` | Update post |
| `DELETE` | `/api/posts/:id` | Delete post |
| `POST` | `/api/posts/:id/publish` | Publish post |
| `POST` | `/api/ai/generate` | Generate content with AI |
| `POST` | `/api/ai/seo` | Generate SEO metadata |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login user |

---

## Deployment

| Service | Platform | Auto-Deploy |
|---------|----------|-------------|
| Frontend | Vercel | ✅ On push to `main` |
| Backend | Render | ✅ On push to `main` |
| Database | Neon | — |
| Redis | Upstash / Render | — |

---

## Environment Variables Reference

<details>
<summary><strong>Frontend (Vercel)</strong></summary>

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL |
| `NEXTAUTH_URL` | ✅ | Frontend URL |
| `NEXTAUTH_SECRET` | ✅ | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth secret |
| `GITHUB_ID` | ❌ | GitHub OAuth client ID |
| `GITHUB_SECRET` | ❌ | GitHub OAuth secret |

</details>

<details>
<summary><strong>Backend (Render)</strong></summary>

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `FRONTEND_URL` | ✅ | Frontend URL (for CORS) |
| `NEXTAUTH_SECRET` | ✅ | **Must match frontend secret** for JWT verification |
| `GROQ_API_KEY` | ✅ | Groq API key for AI |
| `HF_API_TOKEN` | ✅ | HuggingFace API token |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret |
| `NODE_ENV` | ✅ | `production` |

</details>

> ⚠️ **Critical**: The `NEXTAUTH_SECRET` must be **exactly the same** in both frontend (Vercel) and backend (Render) for authentication to work. This secret is used to sign JWTs in the frontend and verify them in the backend.

---

## License

MIT © [VirtusDakura](https://github.com/VirtusDakura)
