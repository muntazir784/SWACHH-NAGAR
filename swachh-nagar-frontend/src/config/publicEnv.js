/**
 * Vite inlines env at build time. If Vercel/Netlify omit VITE_API_URL, production would wrongly fall back to localhost.
 * Default production API to the deployed Render service; override anytime with VITE_* in the host dashboard.
 */
const PROD_API_BASE = 'https://swachh-nagar.onrender.com/api/v1';
const PROD_SOCKET = 'https://swachh-nagar.onrender.com';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PROD_API_BASE : 'http://localhost:5001/api/v1');

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD ? PROD_SOCKET : 'http://localhost:5001');
