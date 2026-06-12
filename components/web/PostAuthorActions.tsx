'use client';

import { deleteBlogAction } from '@/app/actions';
import { Button, buttonVariants } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useConvexAuth, useQuery } from 'convex/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';

export function PostAuthorActions({ postId }: { postId: Id<'posts'> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const post = useQuery(api.posts.getPostById, { postId });
  const userId = useQuery(api.presence.getUserId);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (isLoading || !isAuthenticated || !post || !userId) {
    return null;
  }

  if (post.authorId !== userId) {
    return null;
  }

  const slug = post.slug ?? postId;

  function handleDelete() {
    if (
      !window.confirm(
        'Delete this post permanently? Comments and the cover image will be removed. This cannot be undone.'
      )
    ) {
      return;
    }

    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteBlogAction(postId, slug);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      router.push('/blog');
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Link
        href={`/blog/${slug}/edit`}
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
        Edit post
      </Link>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={handleDelete}>
        {isPending ? 'Deleting…' : 'Delete'}
      </Button>
      {deleteError ?
        <p className="basis-full text-right text-sm text-destructive">
          {deleteError}
        </p>
      : null}
    </div>
  );
}
