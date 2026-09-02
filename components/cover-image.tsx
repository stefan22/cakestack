import Image from 'next/image';

interface CoverImageProps {
  src: string;
  title: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function CoverImage({
  src,
  title,
  className,
  sizes,
  priority,
}: CoverImageProps) {
  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes={sizes ?? '(min-width: 1024px) 400px, 90vw'}
      priority={priority}
      className={className}
    />
  );
}
