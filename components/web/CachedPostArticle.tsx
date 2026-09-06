import { Separator } from '@/components/ui';
import { PostBody } from '@/components/web/PostBody';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery } from 'convex/nextjs';
import Image from 'next/image';
import { cacheLife, cacheTag } from 'next/cache';

const FALLBACK_IMAGE =
  'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242402/next-blog/uh7oe6qxtuileqw8rnbm.png';

export async function CachedPostArticle({ postId }: { postId: Id<'posts'> }) {
  'use cache';
  cacheLife('hours');
  cacheTag('blog');
  cacheTag(`post:${postId}`);

  const post = await fetchQuery(api.posts.getPostById, { postId });

  if (!post) {
    return <h1 className="text-3xl text-red-500 py-10">No post found</h1>;
  }

  const postedAt = post.updatedAt ?? post._creationTime;

  return (
    <>
      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.imageUrl ?? FALLBACK_IMAGE}
          alt={post.title}
          fill
          loading="eager"
          sizes="lg"
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(postedAt).toLocaleDateString('en-GB')}
          {post.updatedAt !== undefined && (
            <span className="ml-2 text-xs">(updated)</span>
          )}
        </p>
      </div>

      <Separator className="my-8" />

      <PostBody markdown={post.body} />
    </>
  );
}
