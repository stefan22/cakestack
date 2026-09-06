import { describe, it, expect } from 'vitest';
import { commentSchema } from '@/app/schemas/comment';

const samplePostId =
  'jh7examplepost123' as import('@/convex/_generated/dataModel').Id<'posts'>;

describe('commentSchema', () => {
  it('accepts valid body and postId', () => {
    const result = commentSchema.safeParse({
      body: 'abc',
      postId: samplePostId,
    });
    expect(result.success).toBe(true);
  });

  it('rejects body shorter than 3 characters', () => {
    const result = commentSchema.safeParse({
      body: 'ab',
      postId: samplePostId,
    });
    expect(result.success).toBe(false);
  });
});
