import { PostEditor } from '@/components/web/PostEditor';
import { updateBlogAction } from '@/app/actions';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchAuthQuery } from '@/lib/auth-server';
import { fetchQuery } from 'convex/nextjs';
import { notFound, redirect } from 'next/navigation';

interface EditPostPageProps {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;

  const [post, userId] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId }),
    fetchAuthQuery(api.presence.getUserId, {}),
  ]);

  if (!post) {
    notFound();
  }

  if (!userId || post.authorId !== userId) {
    redirect(`/blog/${postId}`);
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Edit Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Update your Markdown article
        </p>
      </div>

      <PostEditor
        mode="edit"
        postId={postId}
        defaultValues={{
          title: post.title,
          content: post.body,
        }}
        onSubmit={updateBlogAction}
      />
    </div>
  );
}
