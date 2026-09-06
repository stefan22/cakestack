import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { authComponent } from './auth';
import { Doc } from './_generated/dataModel';
import { uniqueSlug } from './slug';

async function isSlugTaken(ctx: QueryCtx, candidate: string): Promise<boolean> {
  const existing = await ctx.db
    .query('posts')
    .withIndex('by_slug', (q) => q.eq('slug', candidate))
    .first();
  return existing !== null;
}

export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }

    const slug = await uniqueSlug(args.title, (candidate) =>
      isSlugTaken(ctx, candidate)
    );

    const postId = await ctx.db.insert('posts', {
      body: args.body,
      title: args.title,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
      slug,
    });

    return { postId, slug };
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('posts').order('desc').collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined ?
            await ctx.storage.getUrl(post.imageStorageId)
          : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id('posts'),
    title: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError('Post not found');
    }

    if (post.authorId !== user._id) {
      throw new ConvexError('Unauthorized');
    }

    const patch: {
      title: string;
      body: string;
      updatedAt: number;
      imageStorageId?: typeof args.imageStorageId;
      slug?: string;
    } = {
      title: args.title,
      body: args.body,
      updatedAt: Date.now(),
    };

    if (args.imageStorageId !== undefined) {
      patch.imageStorageId = args.imageStorageId;
    }

    // Slug is immutable once set (editing the title never changes the URL).
    // The only time we set it here is a never-backfilled older post, so it
    // still ends up with one rather than staying permanently un-linkable.
    let slug = post.slug;
    if (!slug) {
      slug = await uniqueSlug(args.title, (candidate) =>
        isSlugTaken(ctx, candidate)
      );
      patch.slug = slug;
    }

    await ctx.db.patch(args.postId, patch);

    return { postId: args.postId, slug };
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError('Not authenticated');
    }

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError('Post not found');
    }

    if (post.authorId !== user._id) {
      throw new ConvexError('Unauthorized');
    }

    const comments = await ctx.db
      .query('comments')
      .withIndex('by_postId', (q) => q.eq('postId', args.postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    if (post.imageStorageId !== undefined) {
      await ctx.storage.delete(post.imageStorageId);
    }

    await ctx.db.delete(args.postId);
  },
});

export const getPostById = query({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      return null;
    }

    const resolvedImageUrl =
      post?.imageStorageId !== undefined ?
        await ctx.storage.getUrl(post.imageStorageId)
      : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl,
    };
  },
});

export const getPostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query('posts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (!post) {
      return null;
    }

    const resolvedImageUrl =
      post.imageStorageId !== undefined ?
        await ctx.storage.getUrl(post.imageStorageId)
      : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl,
    };
  },
});

/**
 * One-off migration for posts created before the `slug` field existed.
 * Internal-only (not callable from the client) — run it yourself with:
 *   npx convex run posts:backfillSlugs
 * Safe to re-run: skips any post that already has a slug.
 */
export const backfillSlugs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('posts').collect();
    const updated: Array<{ postId: string; slug: string }> = [];

    for (const post of posts) {
      if (post.slug) continue;

      const slug = await uniqueSlug(post.title, (candidate) =>
        isSlugTaken(ctx, candidate)
      );
      await ctx.db.patch(post._id, { slug });
      updated.push({ postId: post._id, slug });
    }

    return updated;
  },
});

interface searchResultTypes {
  _id: string;
  slug: string;
  title: string;
  body: string;
}

export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const results: Array<searchResultTypes> = [];

    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<'posts'>>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          // Falls back to the raw id only for the rare pre-backfill post;
          // once backfillSlugs has run, every doc has a real slug.
          slug: doc.slug ?? doc._id,
          title: doc.title,
          body: doc.body,
        });
        if (results.length >= limit) break;
      }
    };

    const titleMatches = await ctx.db
      .query('posts')
      .withSearchIndex('search_title', (q) => q.search('title', args.term))
      .take(limit);

    await pushDocs(titleMatches);

    //whether to extend term search matches beyond titles
    if (results.length < limit) {
      const bodyMatches = await ctx.db
        .query('posts')
        .withSearchIndex('search_body', (q) => q.search('body', args.term))
        .take(limit);

      await pushDocs(bodyMatches);
    }

    return results;
  },
});
