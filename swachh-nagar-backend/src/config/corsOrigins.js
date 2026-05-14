/**
 * CLIENT_URL (single) or CLIENT_URLS (comma-separated) must list every deployed frontend origin, e.g.
 * https://swachh-nagar.vercel.app
 * Local dev: http://localhost:* is always allowed when origin is present.
 */
function parseClientOrigins() {
  const parts = [process.env.CLIENT_URL, process.env.CLIENT_URLS].filter(Boolean).join(',');
  return parts
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isClientOriginAllowed(origin) {
  if (!origin) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^https:\/\/localhost:\d+$/.test(origin)) return true;
  return parseClientOrigins().includes(origin);
}

module.exports = { isClientOriginAllowed, parseClientOrigins };
