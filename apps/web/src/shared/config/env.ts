export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  NODE_ENV: import.meta.env.MODE || 'development',
};
