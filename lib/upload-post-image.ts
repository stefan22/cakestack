import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchAuthMutation } from '@/lib/auth-server';

export async function uploadPostImage(
  image: File
): Promise<Id<'_storage'> | { error: string }> {
  const imageUrl = await fetchAuthMutation(
    api.posts.generateImageUploadUrl,
    {}
  );

  const uploadResult = await fetch(imageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': image.type,
    },
    body: image,
  });

  if (!uploadResult.ok) {
    return { error: 'Failed to upload image' };
  }

  const { storageId } = await uploadResult.json();
  return storageId as Id<'_storage'>;
}
