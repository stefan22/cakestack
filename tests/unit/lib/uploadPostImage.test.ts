import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchAuthMutation = vi.fn();

vi.mock('@/lib/auth-server', () => ({
  fetchAuthMutation,
}));

const { uploadPostImage } = await import('@/lib/upload-post-image');

function fakeImage() {
  return new File(['x'], 'cover.png', { type: 'image/png' });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

describe('uploadPostImage', () => {
  it('requests an upload url, PUTs the image, and returns the storage id', async () => {
    fetchAuthMutation.mockResolvedValue('https://convex.site/upload?token=1');
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ storageId: 'storage_abc' }), {
        status: 200,
      }),
    );

    const result = await uploadPostImage(fakeImage());

    expect(result).toBe('storage_abc');
    expect(fetch).toHaveBeenCalledWith(
      'https://convex.site/upload?token=1',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
      }),
    );
  });

  it('returns an error when the upload response is not ok', async () => {
    fetchAuthMutation.mockResolvedValue('https://convex.site/upload?token=1');
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

    const result = await uploadPostImage(fakeImage());

    expect(result).toEqual({ error: 'Failed to upload image' });
  });
});
