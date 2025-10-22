export const baseURL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_BASE_URL;
