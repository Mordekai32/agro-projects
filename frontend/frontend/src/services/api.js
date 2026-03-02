import axios from 'axios';

/**
 * Get API base URL from environment variables.
 * Supports both CRA (REACT_APP_API_URL) and Vite (VITE_API_URL).
 */
function getApiBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return undefined;
}

let API_BASE_URL = getApiBaseUrl();

if (!API_BASE_URL) {
  console.warn(
    'API URL not set. Falling back to http://localhost:5000/api.\n' +
    'Set REACT_APP_API_URL or VITE_API_URL in your .env file.'
  );
  API_BASE_URL = 'http://localhost:5000/api';
} else {
  API_BASE_URL = API_BASE_URL.replace(/\/+$/, '');
}

console.log('API Base URL:', API_BASE_URL);

// ─── AXIOS INSTANCE ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── REQUEST INTERCEPTOR — attach JWT token to every request ─────────────────
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      null;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`[API] Attached token to ${config.method.toUpperCase()} ${config.url}`);
    } else {
      console.warn(`[API] No token found for ${config.method.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR — handle auth errors globally ──────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    if (status === 401) {
      console.error(
        `[API] 401 Unauthorized — ${method} ${url}\n` +
        'Token missing, expired, or invalid.\n' +
        'Ensure your AuthContext stores the token under localStorage key "token".'
      );
    }

    if (status === 403) {
      console.error(
        `[API] 403 Forbidden — ${method} ${url}\n` +
        'Insufficient permissions for this action.\n' +
        'Check the response data for details:',
        error.response?.data
      );
    }

    return Promise.reject(error);
  }
);

// ─── Helper: call this right after login to store token ──────────────────────
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('[API] Token stored and default header set.');
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('[API] Token cleared.');
  }
};

// ─── Helper: call this on logout to clear token ──────────────────────────────
export const clearAuthToken = () => setAuthToken(null);

// ========== Auth / User ==========
export const getCurrentUser = () => api.get('/auth/me');
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');

// ========== User Management ==========
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Role-specific user fetches
export const getFarmers = async () => {
  const response = await getUsers();
  return { ...response, data: response.data.filter(user => user.user_type === 'farmer') };
};
export const getBuyers = async () => {
  const response = await getUsers();
  return { ...response, data: response.data.filter(user => user.user_type === 'buyer') };
};
export const getAdmins = async () => {
  const response = await getUsers();
  return { ...response, data: response.data.filter(user => user.user_type === 'admin') };
};

// ========== Products ==========
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ========== Transactions ==========
export const getAllTransactions = () => api.get('/transactions/all');
export const getMyTransactions = () => api.get('/transactions/me');
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const updateTransaction = (id, transactionData) => api.put(`/transactions/${id}`, transactionData);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export const getTransactions = getAllTransactions;

export const getRecentTransactions = async (limit = 5) => {
  const response = await getAllTransactions();
  return { ...response, data: response.data.slice(0, limit) };
};

// ========== Weather ==========
export const getWeather = () => api.get('/weather');
export const getWeatherDistrict = (district) => api.get(`/weather/${district}`);
export const createWeather = (weatherData) => api.post('/weather', weatherData);
export const updateWeather = (id, weatherData) => api.put(`/weather/${id}`, weatherData);
export const deleteWeather = (id) => api.delete(`/weather/${id}`);

// ========== Advisory / Articles ==========
export const getAdvisory = () => api.get('/advisory');
export const getAdvisoryArticle = (id) => api.get(`/advisory/${id}`);
export const createAdvisory = (articleData) => api.post('/advisory', articleData);
export const updateAdvisory = (id, articleData) => api.put(`/advisory/${id}`, articleData);
export const deleteAdvisory = (id) => api.delete(`/advisory/${id}`);

export const getArticles = getAdvisory;
export const getArticle = getAdvisoryArticle;

export default api;