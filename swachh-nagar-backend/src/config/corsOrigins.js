/**
 * CLIENT_URL (single) or CLIENT_URLS (comma-separated) must list every deployed frontend origin, e.g.
 * https://swachh-nagar.vercel.app
 * Local dev: http://localhost:* is always allowed when origin is present.
 */
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

function isClientOriginAllowed(origin) {
  if (!origin) return true;
  const o = normalizeOrigin(origin);
  if (/^http:\/\/localhost:\d+$/.test(o)) return true;
  if (/^https:\/\/localhost:\d+$/.test(o)) return true;
  return parseClientOrigins().includes(o);
}

module.exports = { isClientOriginAllowed, parseClientOrigins };
