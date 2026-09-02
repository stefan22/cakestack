import { query, mutation } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from '@/convex/auth';

export const getCommentsByPostId = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query('comments')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .order('desc')
      .collect();

    return data;
  },
});

export const createComment = mutation({
  args: {
    body: v.string(),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError('User not authenticated');
    }

    return await ctx.db.insert('comments', {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});
