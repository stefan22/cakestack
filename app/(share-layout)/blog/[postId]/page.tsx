import { buttonVariants, Separator } from '@/components/ui';
import { CachedPostArticle } from '@/components/web/CachedPostArticle';
import { PostAuthorActions } from '@/components/web/PostAuthorActions';
import { CommentSection } from '@/components/web/CommentSection';
import { PostPresence } from '@/components/web/PostPresence';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchAuthQuery } from '@/lib/auth-server';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: post.title,
    description: post.body.slice(0, 160),
    authors: [{ name: 'admin@CakeStack' }],
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;

  const [preloadedComments, userId] = await Promise.all([
    preloadQuery(api.comments.getCommentsByPostId, { postId }),
    fetchAuthQuery(api.presence.getUserId, {}),
  ]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-0 md:px-4 animate-in fade-in duration-500 relative">
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
      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
