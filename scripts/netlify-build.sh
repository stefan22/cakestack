#!/usr/bin/env bash
set -euo pipefail

npx convex deploy \
  --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL \
  --cmd 'npm run build'
