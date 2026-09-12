/** Shared Tailwind Typography classes for rendered Markdown */
export const proseClassName =
  'prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-primary';

/** Plain-text excerpt for list cards (strips common Markdown syntax) */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^>\s?/gm, '')
    .replace(/[-*+]\s+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}
