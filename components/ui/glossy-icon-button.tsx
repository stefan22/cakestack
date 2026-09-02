import { cn } from '@/lib/utils';

interface GlossyIconButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The embossed circular frame used on card corners and illustration
 * overlays: a soft inset highlight that deepens into a pressed-in shadow
 * on hover. Wrap in an element with `group`/`group-hover` (or `has-hover`
 * if you have that variant) on an ancestor to trigger the hover state.
 */
export function GlossyIconButton({
  children,
  className,
}: GlossyIconButtonProps) {
  return (
    <span
      className={cn(
        'inline-flex size-fit shrink-0 overflow-hidden rounded-full bg-background p-1 shadow-[inset_-0.5px_-0.5px_1px_0_rgba(0,0,0,0.6)] transition-shadow duration-500 group-hover:shadow-[inset_0_-2px_4px_0_rgba(0,0,0,0.6)] dark:shadow-[inset_-0.5px_-0.5px_1px_0_rgba(255,255,255,0.6)] dark:group-hover:shadow-[inset_0_-2px_4px_0_rgba(255,255,255,0.6)]',
        className
      )}>
      <span className="flex size-9 items-center justify-center rounded-full">
        {children}
      </span>
    </span>
  );
}
