#!/bin/bash
# SessionStart hook: prepare a remote Claude Code session so that
# `npm run verify` and `npm run test:e2e` work without any manual bootstrap.
#
# Runs synchronously, so dependencies are guaranteed present before the
# agent's first turn. Safe to re-run: npm install is idempotent.
set -euo pipefail

# Local machines already have their own setup; only bootstrap remote sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# `npm install` (not `ci`) so the warm container cache is reused across sessions.
echo "session-start: installing npm dependencies..."
npm install --no-audit --no-fund

# Playwright's Chromium is baked into the remote image. Point Playwright at it
# instead of downloading a second copy, and persist the vars for the session.
if [ -d /opt/pw-browsers ]; then
  echo "session-start: using pre-installed Playwright browsers"
  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    {
      echo 'export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers'
      echo 'export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1'
    } >> "$CLAUDE_ENV_FILE"
  fi
else
  echo "session-start: pre-installed browsers not found, fetching Chromium"
  npx playwright install --with-deps chromium
fi

echo "session-start: ready — run 'npm run verify' for the full gate"
