import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    imageStorageId: v.optional(v.id('_storage')),
    updatedAt: v.optional(v.number()),
    // Optional so existing posts don't fail schema validation until they're
    // backfilled (see posts.backfillSlugs). New posts always get one at
    // creation. Immutable once set — never regenerated from title edits, so
    // published URLs and any backlinks never break.
    slug: v.optional(v.string()),
  })
    .index('by_slug', ['slug'])
    .searchIndex('search_title', {
      searchField: 'title',
    })
    .searchIndex('search_body', {
      searchField: 'body',
    }),
  comments: defineTable({
    postId: v.id('posts'),
    authorId: v.string(),
    authorName: v.string(),
    body: v.string(),
  }),
});
