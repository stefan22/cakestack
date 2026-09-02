import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CoverImage } from '@/components/web/cover-image';
import { GlossyIconButton } from '@/components/ui/glossy-icon-button';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/lib/blog-data';
import { formatDate } from '@/lib/blog-data';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <CoverImage
            src={post.cover}
            title={post.title}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-e-3.5 bottom-3.5">
            <GlossyIconButton>
              <ArrowRight className="size-4 -rotate-45" />
            </GlossyIconButton>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="rounded-full font-normal">
              {post.tag}
            </Badge>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>

          <p className="mt-auto pt-3 text-sm text-muted-foreground">
            {post.author.name} &middot; {post.author.role}
          </p>
        </div>
      </article>
    </Link>
  );
}
