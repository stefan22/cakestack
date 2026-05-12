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

function validFormData() {
  const formData = new FormData();
  formData.append('title', '123456');
  formData.append('content', '1234567890');
  formData.append('image', new File([], 'cover.png', { type: 'image/png' }));
  return formData;
}

describe('createBlogAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
  });

  it('returns generic error when validation fails', async () => {
    const { createBlogAction } = await import('@/app/actions');

    const formData = new FormData();
    formData.append('title', 'short');
    formData.append('content', '1234567890');
    formData.append(
      'image',
      new File([], 'cover.png', { type: 'image/png' })
    );

    const result = await createBlogAction(formData);

    expect(result).toEqual({ error: 'Failed to create blog post' });
    expect(uploadPostImage).not.toHaveBeenCalled();
    expect(fetchAuthMutation).not.toHaveBeenCalled();
  });

  it('returns upload error when uploadPostImage returns error', async () => {
    uploadPostImage.mockResolvedValue({ error: 'Failed to upload image' });

    const { createBlogAction } = await import('@/app/actions');

    const result = await createBlogAction(validFormData());

    expect(result).toEqual({ error: 'Failed to upload image' });
    expect(uploadPostImage).toHaveBeenCalledTimes(1);
    expect(fetchAuthMutation).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('calls mutations, revalidates, and redirects on success', async () => {
    const postId = 'kg_post_test123';
    uploadPostImage.mockResolvedValue('kg_storage_test123');
    fetchAuthMutation.mockResolvedValueOnce(postId);

    const { createBlogAction } = await import('@/app/actions');

    await expect(createBlogAction(validFormData())).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(uploadPostImage).toHaveBeenCalledTimes(1);
    expect(fetchAuthMutation).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith('blog', 'hours');
    expect(revalidateTag).toHaveBeenCalledWith(`post:${postId}`, 'hours');
    expect(revalidatePath).toHaveBeenCalledWith('/blog');
    expect(redirect).toHaveBeenCalledWith(`/blog/${postId}`);
  });

  it('returns generic error when fetchAuthMutation throws', async () => {
    uploadPostImage.mockResolvedValue('kg_storage_test123');
    fetchAuthMutation.mockRejectedValueOnce(new Error('network'));

    const { createBlogAction } = await import('@/app/actions');

    const result = await createBlogAction(validFormData());

    expect(result).toEqual({ error: 'Failed to create blog post' });
  });
});
