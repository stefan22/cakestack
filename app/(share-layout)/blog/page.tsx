import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import Link from 'next/link';
import { Suspense } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { Metadata } from 'next';
import { stripMarkdown } from '@/lib/markdown';
import { BlurFade } from '@/components/motion/blur-fade';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import {
  BlogCoverFooter,
  BlogCoverLink,
} from '@/components/web/blog-cover-link';

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
    <div className="mb-12 flex-col">
      <section className="mx-auto max-w-7xl px-0 pt-16 text-center sm:pt-24">
        <StaggerContainer
          staggerDelay={0.12}
          className="flex flex-col items-center gap-5 mb-12">
          <StaggerItem yOffset={16}>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Blog Posts
            </h1>
          </StaggerItem>

          <StaggerItem yOffset={16}>
            <p className="max-w-4xl text-lg text-muted-foreground">
              Frontend development insights
            </p>
          </StaggerItem>
        </StaggerContainer>

        <BlurFade delay={0.14}>
          <Suspense fallback={<SkeletonLoadingUi />}>
            <LoadBlogList />
          </Suspense>
        </BlurFade>
      </section>
    </div>
  );
}

const LoadBlogList = async () => {
  'use cache';
  cacheLife('hours');
  cacheTag('blog');

  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid w-full gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post, index) => (
        <Card className="w-full pt-0" key={post._id}>
          <BlogCoverLink post={post} priority={index === 0} />

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

          <BlogCoverFooter post={post} />
        </Card>
      ))}
    </div>
  );
};

function SkeletonLoadingUi() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3 w-full" key={i}>
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
