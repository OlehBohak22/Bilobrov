export const API_URL_BASE =
  import.meta.env.VITE_APP_API_URL ||
  "https://bilobrov.projection-learn.website/wp-json/";
export const API_URL =
  import.meta.env.VITE_APP_API_URL_BASE ||
  "https://bilobrov.projection-learn.website";

export const API_URL_WC = `${API_URL_BASE}wc/v3/`;
export const API_URL_WP = `${API_URL_BASE}responses/v1/`;
export const API_URL_WP_V2 = `${API_URL_BASE}wp/v2/`;

export const consumerKey = import.meta.env.VITE_APP_CONSUMER_KEY;
export const consumerSecret = import.meta.env.VITE_APP_CONSUMER_SECRET;
