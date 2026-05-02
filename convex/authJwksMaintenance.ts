import { internalMutation } from './_generated/server';
import { components } from './_generated/api';
import { v } from 'convex/values';

type JwksFindManyBatch = {
  page: Array<{ _id: string }>;
  isDone?: boolean;
  continueCursor?: string | null;
};

/**
 * Deletes every row in the Better Auth component `jwks` table.
 * Run after rotating `BETTER_AUTH_SECRET` when you see
 * "failed to decrypt private key" on `/api/auth/convex/token`.
 *
 * Setup:
 *   npx convex env set AUTH_JWKS_MAINTENANCE_TOKEN "<long-random-string>"
 *
 * Run (from project root):
 *   npx convex run authJwksMaintenance:clearAllJwtSigningKeys \
 *     '{"maintenanceToken":"<same-as-env>"}'
 *
 * Remove the env var when done. Active sessions may need to sign in again.
 */
export const clearAllJwtSigningKeys = internalMutation({
  args: { maintenanceToken: v.string() },
  handler: async (ctx, { maintenanceToken }) => {
    const expected = process.env.AUTH_JWKS_MAINTENANCE_TOKEN;
    if (!expected || maintenanceToken !== expected) {
      throw new Error(
        'Refusing to clear JWKS: set Convex env AUTH_JWKS_MAINTENANCE_TOKEN and pass the same value as maintenanceToken.'
      );
    }

    let cursor: string | null = null;
    let deleted = 0;

    for (;;) {
      const batch = (await ctx.runQuery(
        components.betterAuth.adapter.findMany,
        {
          model: 'jwks',
          paginationOpts: { cursor, numItems: 100 },
        }
      )) as JwksFindManyBatch;

      const page = Array.isArray(batch.page) ? batch.page : [];

      for (const row of page) {
        await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
          input: {
            model: 'jwks',
            where: [
              { field: '_id', operator: 'eq' as const, value: row._id },
            ],
          },
        });
        deleted += 1;
      }

      if (batch.isDone || typeof batch.continueCursor !== 'string') break;
      cursor = batch.continueCursor;
    }

    return { deleted };
  },
});
