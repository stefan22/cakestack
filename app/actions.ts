'use server';

import { postSchema, updatePostSchema } from '@/app/schemas/blog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { uploadPostImage } from '@/lib/upload-post-image';
import { fetchAuthMutation } from '@/lib/auth-server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

function revalidatePost(postId: string, slug: string) {
  // Cache tags stay keyed by the real Convex id (see CachedPostArticle) —
  // only the path being revalidated needs the slug, since that's what's
  // actually served at /blog/{slug} now.
  revalidateTag('blog', 'hours');
  revalidateTag(`post:${postId}`, 'hours');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
}

/**
 * Uses FormData so the browser sends a real File (Next Server Actions cannot
 * reliably serialize File inside a plain POJO argument from the client.)
 */
export async function createBlogAction(formData: FormData) {
  const parsed = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    image: formData.get('image'),
  });

  if (!parsed.success) {
    return { error: 'Failed to create blog post' };
  }

  try {
    const storageResult = await uploadPostImage(parsed.data.image);

    if (typeof storageResult === 'object' && 'error' in storageResult) {
      return { error: storageResult.error };
    }

    const { postId, slug } = await fetchAuthMutation(api.posts.createPost, {
      body: parsed.data.content,
      title: parsed.data.title,
      imageStorageId: storageResult,
    });

    revalidatePost(postId, slug);
    redirect(`/blog/${slug}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: 'Failed to create blog post',
    };
  }
}

export async function updateBlogAction(formData: FormData) {
  const imageEntry = formData.get('image');
  const parsed = updatePostSchema.safeParse({
    postId: formData.get('postId'),
    title: formData.get('title'),
    content: formData.get('content'),
    image:
      imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : undefined,
  });

  if (!parsed.success) {
    return { error: 'Failed to update blog post' };
  }

  try {
    const postId = parsed.data.postId as Id<'posts'>;

    let imageStorageId: Id<'_storage'> | undefined;

    if (parsed.data.image) {
      const storageResult = await uploadPostImage(parsed.data.image);

      if (typeof storageResult === 'object' && 'error' in storageResult) {
        return { error: storageResult.error };
      }

      imageStorageId = storageResult;
    }

    const { slug } = await fetchAuthMutation(api.posts.updatePost, {
      postId,
      title: parsed.data.title,
      body: parsed.data.content,
      imageStorageId,
    });

    revalidatePost(postId, slug);
    redirect(`/blog/${slug}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: 'Failed to update blog post',
    };
  }
}

export async function deleteBlogAction(
  postId: Id<'posts'>,
  slug: string
): Promise<{ error?: string }> {
  try {
    await fetchAuthMutation(api.posts.deletePost, { postId });
    revalidatePost(postId, slug);
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete post' };
  }
  return {};
}
