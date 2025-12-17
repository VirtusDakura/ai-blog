-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SPAM');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('ACTIVE', 'UNSUBSCRIBED', 'BOUNCED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "adPlacements" TEXT,
ADD COLUMN     "adsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adsProvider" TEXT,
ADD COLUMN     "adsPublisherId" TEXT,
ADD COLUMN     "adsTxt" TEXT,
ADD COLUMN     "allowComments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "analyticsId" TEXT,
ADD COLUMN     "autoAds" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "darkMode" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN     "donationMessage" TEXT,
ADD COLUMN     "donationsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailDigest" TEXT NOT NULL DEFAULT 'weekly',
ADD COLUMN     "emailOnComment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailOnSubscriber" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableJsonLd" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableRss" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableSitemap" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "facebookPage" TEXT,
ADD COLUMN     "font" TEXT NOT NULL DEFAULT 'inter',
ADD COLUMN     "footerCode" TEXT,
ADD COLUMN     "headerCode" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "layout" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "minimumPayout" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "moderateComments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "paypalEmail" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "showAuthorBio" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "suggestedAmounts" TEXT,
ADD COLUMN     "twitterHandle" TEXT;

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#8b5cf6',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'default',
    "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "SubscriberStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "recipients" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "stripePaymentId" TEXT,
    "paypalPaymentId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "settings" TEXT,
    "blogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_userId_idx" ON "categories"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_slug_key" ON "categories"("userId", "slug");

-- CreateIndex
CREATE INDEX "tags_userId_idx" ON "tags"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_userId_name_key" ON "tags"("userId", "name");

-- CreateIndex
CREATE INDEX "pages_userId_idx" ON "pages"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pages_userId_slug_key" ON "pages"("userId", "slug");

-- CreateIndex
CREATE INDEX "subscribers_userId_idx" ON "subscribers"("userId");

-- CreateIndex
CREATE INDEX "subscribers_status_idx" ON "subscribers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_userId_email_key" ON "subscribers"("userId", "email");

-- CreateIndex
CREATE INDEX "campaigns_userId_idx" ON "campaigns"("userId");

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "donations_userId_idx" ON "donations"("userId");

-- CreateIndex
CREATE INDEX "donations_createdAt_idx" ON "donations"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "integrations_blogId_idx" ON "integrations"("blogId");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_blogId_name_key" ON "integrations"("blogId", "name");

-- CreateIndex
CREATE INDEX "comments_status_idx" ON "comments"("status");

-- CreateIndex
CREATE INDEX "posts_categoryId_idx" ON "posts"("categoryId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
