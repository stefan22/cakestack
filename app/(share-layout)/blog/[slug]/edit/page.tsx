import { PostEditor } from '@/components/web/PostEditor';
import { updateBlogAction } from '@/app/actions';
import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/lib/auth-server';
import { fetchQuery } from 'convex/nextjs';
import { notFound, redirect } from 'next/navigation';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { BlurFade } from '@/components/motion/blur-fade';

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  const [post, userId] = await Promise.all([
    fetchQuery(api.posts.getPostBySlug, { slug }),
    fetchAuthQuery(api.presence.getUserId, {}),
  ]);

  if (!post) {
    notFound();
  }

  if (!userId || post.authorId !== userId) {
    redirect(`/blog/${slug}`);
  }

  return (
    <div className="py-12">
      <StaggerContainer staggerDelay={0.1} className="text-center mb-12">
        <StaggerItem yOffset={14}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Edit Post
          </h1>
        </StaggerItem>
        <StaggerItem yOffset={14}>
          <p className="text-xl text-muted-foreground pt-4">
            Update your Markdown article
          </p>
        </StaggerItem>
      </StaggerContainer>

      <BlurFade delay={0.18}>
        <PostEditor
          mode="edit"
          postId={post._id}
          defaultValues={{
            title: post.title,
            content: post.body,
          }}
          onSubmit={updateBlogAction}
        />
      </BlurFade>
    </div>
  );
}
