import { describe, it, expect, vi, beforeEach } from 'vitest';

const fetchAuthMutation = vi.fn();
const revalidatePath = vi.fn();
const revalidateTag = vi.fn();

vi.mock('@/lib/auth-server', () => ({
  fetchAuthMutation,
}));

vi.mock('next/cache', () => ({
  revalidatePath,
  revalidateTag,
}));

describe('deleteBlogAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes the post and revalidates blog caches', async () => {
    fetchAuthMutation.mockResolvedValue(undefined);

    const { deleteBlogAction } = await import('@/app/actions');
    const result = await deleteBlogAction(
      'post_123' as never,
      'my-post',
    );

    expect(result).toEqual({});
    expect(fetchAuthMutation).toHaveBeenCalledWith(expect.anything(), {
      postId: 'post_123',
    });
    expect(revalidateTag).toHaveBeenCalledWith('blog', 'hours');
    expect(revalidateTag).toHaveBeenCalledWith('post:post_123', 'hours');
    expect(revalidatePath).toHaveBeenCalledWith('/blog');
    expect(revalidatePath).toHaveBeenCalledWith('/blog/my-post');
  });

  it('returns an error and skips revalidation when the mutation rejects', async () => {
    fetchAuthMutation.mockRejectedValue(new Error('Unauthorized'));

    const { deleteBlogAction } = await import('@/app/actions');
    const result = await deleteBlogAction(
      'post_123' as never,
      'my-post',
    );

    expect(result).toEqual({ error: 'Failed to delete post' });
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
