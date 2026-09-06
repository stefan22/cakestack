import { describe, it, expect, vi, beforeEach } from 'vitest';

const fetchAuthMutation = vi.fn();
const uploadPostImage = vi.fn();
const revalidatePath = vi.fn();
const revalidateTag = vi.fn();
const redirect = vi.fn();

vi.mock('@/lib/auth-server', () => ({
  fetchAuthMutation,
}));

vi.mock('@/lib/upload-post-image', () => ({
  uploadPostImage,
}));

vi.mock('next/cache', () => ({
  revalidatePath,
  revalidateTag,
}));

vi.mock('next/navigation', () => ({
  redirect,
}));

vi.mock('next/dist/client/components/redirect-error', () => ({
  isRedirectError: (error: unknown) =>
    error instanceof Error && error.message === 'NEXT_REDIRECT',
}));

function validFormData(overrides: Record<string, string | File> = {}) {
  const formData = new FormData();
  formData.append('postId', overrides.postId ?? 'post_123');
  formData.append('title', overrides.title ?? '123456');
  formData.append('content', overrides.content ?? '1234567890');
  if (overrides.image) {
    formData.append('image', overrides.image);
  }
  return formData;
}

describe('updateBlogAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  it('returns a generic error when validation fails', async () => {
    const { updateBlogAction } = await import('@/app/actions');

    const formData = validFormData({ title: 'short' });
    const result = await updateBlogAction(formData);

    expect(result).toEqual({ error: 'Failed to update blog post' });
    expect(uploadPostImage).not.toHaveBeenCalled();
    expect(fetchAuthMutation).not.toHaveBeenCalled();
  });

  it('updates without touching image storage when no new image is provided', async () => {
    fetchAuthMutation.mockResolvedValueOnce({
      postId: 'post_123',
      slug: 'my-post',
    });

    const { updateBlogAction } = await import('@/app/actions');

    await expect(updateBlogAction(validFormData())).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(uploadPostImage).not.toHaveBeenCalled();
    expect(fetchAuthMutation).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        postId: 'post_123',
        title: '123456',
        body: '1234567890',
        imageStorageId: undefined,
      })
    );
    expect(redirect).toHaveBeenCalledWith('/blog/my-post');
    expect(revalidateTag).toHaveBeenCalledWith('post:post_123', 'hours');
  });

  it('uploads the new image first when one is provided', async () => {
    uploadPostImage.mockResolvedValue('storage_new');
    fetchAuthMutation.mockResolvedValueOnce({
      postId: 'post_123',
      slug: 'my-post',
    });

    const { updateBlogAction } = await import('@/app/actions');
    const image = new File(['fake-image-bytes'], 'new-cover.png', {
      type: 'image/png',
    });

    await expect(updateBlogAction(validFormData({ image }))).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(uploadPostImage).toHaveBeenCalledTimes(1);
    expect(fetchAuthMutation).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ imageStorageId: 'storage_new' })
    );
  });

  it('returns the upload error and skips the mutation when image upload fails', async () => {
    uploadPostImage.mockResolvedValue({ error: 'Failed to upload image' });

    const { updateBlogAction } = await import('@/app/actions');
    const image = new File(['fake-image-bytes'], 'new-cover.png', {
      type: 'image/png',
    });

    const result = await updateBlogAction(validFormData({ image }));

    expect(result).toEqual({ error: 'Failed to upload image' });
    expect(fetchAuthMutation).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('returns a generic error when the mutation rejects (e.g. unauthorized)', async () => {
    fetchAuthMutation.mockRejectedValueOnce(new Error('Unauthorized'));

    const { updateBlogAction } = await import('@/app/actions');

    const result = await updateBlogAction(validFormData());

    expect(result).toEqual({ error: 'Failed to update blog post' });
    expect(redirect).not.toHaveBeenCalled();
  });
});
