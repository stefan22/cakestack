A NextJS v. **16.2.3** Project

## Next.js React Blog

Route groups • Dynamic route streaming • Suspense boundaries •
Auth flow - Better Auth • Next Proxy •
Server actions • Server-side/ Client-side validation  
File upload Convex • Caching • Re-validation: Time-based/ On-demand • Image optimisation • Metadata • Dynamic generation Seo Tags • Cache components  
Real-time comments Convex DB • Convex Presence (user status, # of online users) •
Markdown Editor

## Tech Stack

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

## How to run

```
 npm install //clone & install dependencies
 npm run dev

 //convex
 npx convex dev

// Open http://localhost:3000
```

## Deploy to Vercel, Netlify, Clouflare

1. Set production environment variables (see [`.env.example`](.env.example)):
   - `CONVEX_DEPLOY_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`
   - `NEXT_PUBLIC_SITE_URL` and `SITE_URL`
   - `BETTER_AUTH_SECRET`, `AUTH_JWKS_URL`
2. Set Convex `SITE_URL`, `BETTER_AUTH_SECRET` envs.

#### Syncs dev back to match prod

```zsh
//convex

npx convex export --prod --include-file-storage
npx convex import --replace
```

<br /><br />

#### [Screenshot]

---

<img src="/public/covers/screenshot.png" alt="app initial screenshot" width="750" height="auto">
