import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,

} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { Metadata } from 'next';
import { stripMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/motion/blur-fade';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';

const TITLE = 'CakeStack Dev Blog';
const DESCRIPTION = 'Web Development Posts';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  category: 'Frontend Development',
  authors: [{ name: 'Admin@CakeStack.uk' }],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/blog',
    type: 'website',
    // Metadata objects don't deep-merge with the root layout's, so the
    // default OG image has to be repeated here or shares would show blank.
    images: [{ url: '/covers/screenshot.png', width: 1439, height: 958 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/covers/screenshot.png'],
  },
};

export default function BlogPage() {
  return (
    <div className="py-16">
      <StaggerContainer
        staggerDelay={0.08}
        className="text-center pb-16">
        <StaggerItem yOffset={12}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Blog Posts
          </h1>
        </StaggerItem>
        <StaggerItem yOffset={12}>
          <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Frontend development insights
          </p>
        </StaggerItem>
      </StaggerContainer>

      <BlurFade delay={0.12}>
        <Suspense fallback={<SkeletonLoadingUi />}>
          <LoadBlogList />
        </Suspense>
      </BlurFade>
    </div>
  );
}

const LoadBlogList = async () => {
  'use cache';
  cacheLife('hours');
  cacheTag('blog');

  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post, index) => (
        <Card className="pt-0" key={post._id}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={
                post.imageUrl ??
                'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242402/next-blog/uh7oe6qxtuileqw8rnbm.png'
              }
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              alt="leaves"
              loading={index === 0 ? 'eager' : 'lazy'}
              className="rounded-t-lg object-cover"
            />
          </div>

          <CardTitle>
            <h1 className="text-2xl font-bold hover:text-primary px-4">
              <Link href={`/blog/${post.slug ?? post._id}`}>{post.title}</Link>
            </h1>
          </CardTitle>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">
              {stripMarkdown(post.body)}
            </p>
          </CardContent>
          <CardFooter>
            <Link
              className={cn(
                buttonVariants({
                  className: 'w-full',
                  size: 'lg',
                })
              )}
              href={`/blog/${post.slug ?? post._id}`}>
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
