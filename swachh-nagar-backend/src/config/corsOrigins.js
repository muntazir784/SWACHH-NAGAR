/**
 * CLIENT_URL (single) or CLIENT_URLS (comma-separated) must list every deployed frontend origin, e.g.
 * https://swachh-nagar.vercel.app
 * Local dev: http://localhost:* is always allowed when origin is present.
 *
 * If CLIENT_URL(S) are unset, the canonical production Vercel origin below is still allowed (merged
 * with env). Set CLIENT_URL / CLIENT_URLS for custom domains or preview URLs.
 */
const DEFAULT_FRONTEND_ORIGINS = ['https://swachh-nagar.vercel.app'];

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return origin;
  return origin.replace(/\/+$/, '');
}

function parseClientOrigins() {
  const parts = [process.env.CLIENT_URL, process.env.CLIENT_URLS].filter(Boolean).join(',');
  return parts
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeOrigin);
}

function effectiveAllowedOrigins() {
  return [...new Set([...DEFAULT_FRONTEND_ORIGINS, ...parseClientOrigins()])];
}

function isClientOriginAllowed(origin) {
  if (!origin) return true;
  const o = normalizeOrigin(origin);
  if (/^http:\/\/localhost:\d+$/.test(o)) return true;
  if (/^https:\/\/localhost:\d+$/.test(o)) return true;
  return effectiveAllowedOrigins().includes(o);
}

module.exports = { isClientOriginAllowed, parseClientOrigins, effectiveAllowedOrigins };
