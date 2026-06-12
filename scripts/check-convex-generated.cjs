/**
 * Convex Netlify/CI / `convex deploy --cmd`: the child `npm run build` runs BEFORE
 * functions upload, so `next build` must resolve `convex/_generated/` from disk.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const api = path.join(root, 'convex', '_generated', 'api.js');

if (!fs.existsSync(api)) {
  console.error(`
Missing ${path.relative(root, api)}.

For Netlify/CI + Convex, codegen runs after Next build unless these files are tracked.
Run: npx convex codegen
Then commit the convex/_generated/ directory.

`);
  process.exit(1);
}
