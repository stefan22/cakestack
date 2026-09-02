'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { BlogCard } from '@/components/web/blog-card';
import type { BlogPost } from '@/lib/blog-data';

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((post) => post.tag)))],
    [posts]
  );

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = activeTag === 'All' || post.tag === activeTag;
      const matchesQuery = post.title
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesTag && matchesQuery;
    });
  }, [posts, activeTag, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            className="pl-9"
            type="search"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => {
            const isActive = tag === activeTag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="relative rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors data-[active=true]:text-foreground"
                data-active={isActive}>
                {isActive && (
                  <motion.span
                    layoutId="tag-pill"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((post, index) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.45,
                ease: [0.25, 0.4, 0.25, 1],
                delay: (index % 6) * 0.05,
              }}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center text-muted-foreground">
          No articles match &ldquo;{query}&rdquo;.
        </motion.p>
      )}
    </div>
  );
}
