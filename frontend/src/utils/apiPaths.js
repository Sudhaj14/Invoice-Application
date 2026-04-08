// apipaths.js

// ✅ Base URL from Vite env
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://invoice-application-lttb.onrender.com";

// ✅ All API endpoints
export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GET_PROFILE: `${BASE_URL}/api/auth/me`,
    UPDATE_PROFILE: `${BASE_URL}/api/auth/me`,
  },

  INVOICE: {
    CREATE: `${BASE_URL}/api/invoices/`,
    GET_ALL_INVOICES: `${BASE_URL}/api/invoices/`,
    GET_INVOICE_BY_ID: (id) => `${BASE_URL}/api/invoices/${id}`,
    UPDATE_INVOICE: (id) => `${BASE_URL}/api/invoices/${id}`,
    DELETE_INVOICE: (id) => `${BASE_URL}/api/invoices/${id}`,
  },
};