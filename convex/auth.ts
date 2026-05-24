import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query } from './_generated/server';
import { betterAuth } from 'better-auth';
import authConfig from './auth.config';

function requireConvexSiteUrl() {
  const url = process.env.SITE_URL?.trim();
  if (!url) {
    throw new Error(
      'Set Convex env SITE_URL to your Next app origin (same value you use in the browser, e.g. http://localhost:3000). CLI: npx convex env set SITE_URL http://localhost:3000'
    );
  }
  return url;
}

/** Used to encrypt JWKS private keys; must stay stable unless you rotate & clear JWKS. */
function requireBetterAuthSecret() {
  const secret =
    process.env.BETTER_AUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error(
      'Set Convex env BETTER_AUTH_SECRET (min 32 chars). Generate: openssl rand -base64 32. If you rotated it, clear JWKS (see convex/authJwksMaintenance.ts) or decryption will fail.'
    );
  }
  return secret;
}

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const siteUrl = requireConvexSiteUrl();
  return betterAuth({
    baseURL: siteUrl,
    secret: requireBetterAuthSecret(),
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        //redirectUri: `${siteUrl}/api/auth/callback/google`,
      }
    },

    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex({ authConfig }),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
