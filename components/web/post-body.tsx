import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { proseClassName } from '@/lib/markdown';
import { cn } from '@/lib/utils';

export function PostBody({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  return (
    <div className={cn(proseClassName, className)}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  );
}
