import { buttonVariants, Separator } from '@/components/ui';
import { CachedPostArticle } from '@/components/web/CachedPostArticle';
import { PostAuthorActions } from '@/components/web/PostAuthorActions';
import { CommentSection } from '@/components/web/CommentSection';
import { PostPresence } from '@/components/web/PostPresence';
import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/lib/auth-server';
import { stripMarkdown } from '@/lib/markdown';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE_URL } from '@/lib/site';

interface PostSlugRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostSlugRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, { slug });

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  const description = stripMarkdown(post.body).slice(0, 160);
  const canonical = `/blog/${slug}`;

  return {
    title: post.title,
    description,
    authors: [{ name: 'admin@CakeStack' }],
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      type: 'article',
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function PostSlugRoute({ params }: PostSlugRouteProps) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, { slug });

  if (!post) {
    notFound();
  }

  const postId = post._id;

  const [preloadedComments, userId] = await Promise.all([
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchAuthQuery(api.presence.getUserId, {}),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: stripMarkdown(post.body).slice(0, 160),
    image: post.imageUrl ? [post.imageUrl] : undefined,
    datePublished: new Date(post._creationTime).toISOString(),
    dateModified: new Date(post.updatedAt ?? post._creationTime).toISOString(),
    author: {
      '@type': 'Person',
      name: 'CakeStack',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-0 md:px-4 animate-in fade-in duration-500 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href="/blog"
          className={cn(buttonVariants({ variant: 'outline' }))}>
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>
        <PostAuthorActions postId={postId} />
      </div>

      <CachedPostArticle postId={postId} />

      {userId && (
        <div className="flex justify-end -mt-4 mb-2">
          <PostPresence roomId={postId} userId={userId} />
        </div>
      )}

      <Separator className="my-8" />
      <CommentSection postId={postId} preloadedComments={preloadedComments} />
    </div>
  );
}
