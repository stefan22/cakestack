import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CoverImage } from '@/components/web/cover-image';
import { GlossyIconButton } from '@/components/ui/glossy-icon-button';
import type { BlogPost } from '@/lib/blog-data';
import { formatDate } from '@/lib/blog-data';

export function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col gap-6 xl:grid xl:grid-cols-2 xl:items-center xl:gap-8">
        <div className="relative aspect-video overflow-hidden rounded-lg xl:aspect-square">
          <CoverImage
            src={post.cover}
            title={post.title}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-e-3.5 bottom-3.5">
            <GlossyIconButton>
              <ArrowRight className="size-4 -rotate-45" />
            </GlossyIconButton>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
          <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="text-muted-foreground">{post.excerpt}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {post.author.name} &middot; {post.author.role}
          </p>
        </div>
      </article>
    </Link>
  );
}
