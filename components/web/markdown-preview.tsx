'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { proseClassName } from '@/lib/markdown';
import { cn } from '@/lib/utils';

export function MarkdownPreview({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  if (!markdown.trim()) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Nothing to preview yet.
      </p>
    );
  }

  return (
    <div className={cn(proseClassName, className)}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  );
}
