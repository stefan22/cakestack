'use client';

import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants, CardFooter } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  type Variants,
} from 'motion/react';
import { useEffect, useRef, useMemo } from 'react';

type BlogCoverLinkProps = {
  post: {
    imageUrl?: string | null;
    slug?: string | undefined;
    _id?: string | undefined;
  };
  priority?: boolean;
};

const cursorVariants: Variants = {
  blinking: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 0,
      ease: 'linear',
      times: [0, 0.5, 0.5, 1],
    },
  },
};

export default function CursorBlinker() {
  return (
    <motion.div
      variants={cursorVariants}
      animate="blinking"
      className="inline-block h-5 w-px translate-y-1 bg-slate-900"
    />
  );
}

export const BlogCoverLink = ({
  post,
  priority = false,
}: BlogCoverLinkProps) => {
  const { slug, _id, imageUrl } = post;

  return (
    <Link href={`/blog/${slug ?? _id}`}>
      <motion.div
        whileHover={{ scale: 1.07 }}
        transition={{ duration: 0.4 }}
        className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            imageUrl ??
            'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242402/next-blog/uh7oe6qxtuileqw8rnbm.png'
          }
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          alt="leaves"
          priority={priority}
          className="rounded-t-lg object-cover"
        />
      </motion.div>
    </Link>
  );
};

type BlogCoverFooterProps = {
  post: {
    imageUrl?: string | null;
    slug?: string;
    _id?: string;
  };
};

export const BlogCoverFooter = ({ post }: BlogCoverFooterProps) => {
  const baseText = `Read fast 💥 more...`;
  const ref = useRef<HTMLSpanElement>(null);

  // 1. Array.from properly splits multi-byte Unicode/emojis without breaking surrogate pairs
  const characters = useMemo(() => Array.from(baseText), [baseText]);

  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const count = useMotionValue(0);

  // 2. Animate index position directly against Unicode-aware character array
  const displayText = useTransform(count, (latest) => {
    const index = Math.round(latest);
    return characters.slice(0, index).join('');
  });

  useEffect(() => {
    if (!isInView) return;

    count.set(0);
    const controls = animate(count, characters.length, {
      type: 'tween',
      duration: 1.2,
      ease: 'easeInOut',
    });

    return () => controls.stop();
  }, [isInView, characters.length, count]);

  return (
    <CardFooter>
      <Link
        className={cn(
          buttonVariants({
            className: 'w-full',
            size: 'lg',
          })
        )}
        href={`/blog/${post.slug ?? post._id}`}>
        <span ref={ref} className="inline-flex align-middle">
          <motion.span>{displayText}</motion.span>
          <CursorBlinker />
        </span>
      </Link>
    </CardFooter>
  );
};
