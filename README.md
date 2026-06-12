A NextJS v. **16.2.3** Project

## Next.js React Blog

Route groups • Dynamic route streaming • Suspense boundaries •
Auth flow - Better Auth • Next Proxy •
Server actions • Server-side/ Client-side validation  
File upload Convex • Caching • Re-validation: Time-based/ On-demand • Image optimisation • Metadata • Dynamic generation Seo Tags • Cache components  
Real-time comments Convex DB • Convex Presence (user status, # of online users) •
Markdown Editor

### Tech Stack

Next.js •
Typescript •
Convex Database •
Shadcn •
TailwindCSS •
Better-Auth •
React Hook form •
Zod schema validation •
Vitest testing framework •
Eslint •
Prettier

```
npm run dev
```

### Quick Start

```
 npm install //clone & install dependencies
 npm run dev

 //convex
 npx convex dev

// Open http://localhost:3000
```

![screenshot.png](/public/covers/screenshot.png)

### Deploy to Netlify (production)

Production URL: `https://blognext.netlify.app`

1. Connect the repo in Netlify; build settings come from [`netlify.toml`](netlify.toml).
2. Set production environment variables (see [`.env.example`](.env.example)):
   - `CONVEX_DEPLOY_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`
   - `NEXT_PUBLIC_SITE_URL` and `SITE_URL` = `https://blognext.netlify.app`
   - `BETTER_AUTH_SECRET`, `AUTH_JWKS_URL`
3. Set matching vars on the Convex production deployment (`SITE_URL`, `BETTER_AUTH_SECRET`, Google OAuth secrets).
4. Google OAuth redirect URI: `https://blognext.netlify.app/api/auth/callback/google`
5. Deploy previews are disabled in `netlify.toml` (production only).

Local dry run:

```bash
npm run build:netlify
```

### Deploy to Netlify (production)

Production URL: `https://blognext.netlify.app`

1. Connect the repo in Netlify; build settings come from [`netlify.toml`](netlify.toml).
2. Set production environment variables (see [`.env.example`](.env.example)):
   - `CONVEX_DEPLOY_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`
   - `NEXT_PUBLIC_SITE_URL` and `SITE_URL` = `https://blognext.netlify.app`
   - `BETTER_AUTH_SECRET`, `AUTH_JWKS_URL`
3. Set matching vars on the Convex production deployment (`SITE_URL`, `BETTER_AUTH_SECRET`, Google OAuth secrets).
4. Google OAuth redirect URI: `https://blognext.netlify.app/api/auth/callback/google`
5. Deploy previews are disabled in `netlify.toml` (production only).

Local dry run:

```bash
npm run build:netlify
```
