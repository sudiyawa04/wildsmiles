import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('ws_token') || (typeof window !== 'undefined' ? localStorage.getItem('ws_token') : null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = Cookies.get('ws_refresh') || localStorage.getItem('ws_refresh');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          Cookies.set('ws_token', data.token, { expires: 7, sameSite: 'strict' });
          localStorage.setItem('ws_token', data.token);
          original.headers.Authorization = `Bearer ${data.token}`;
          return api(original);
        }
      } catch (_) {
        Cookies.remove('ws_token');
        Cookies.remove('ws_refresh');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  getMe:          ()     => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (data) => api.post('/auth/reset-password', data),
  verifyEmail:    (token)=> api.get(`/auth/verify-email?token=${token}`),
};

// ─── Tours ──────────────────────────────────────────────────────────────────
export const toursAPI = {
  getAll:          (params) => api.get('/tours', { params }),
  getFeatured:     ()       => api.get('/tours/featured'),
  getBySlug:       (slug)   => api.get(`/tours/${slug}`),
  getAvailability: (slug)   => api.get(`/tours/${slug}/availability`),
  create:          (data)   => api.post('/tours', data),
  update:          (id, data)=> api.patch(`/tours/${id}`, data),
  delete:          (id)     => api.delete(`/tours/${id}`),
};

// ─── Destinations ────────────────────────────────────────────────────────────
export const destinationsAPI = {
  getAll:      (params) => api.get('/destinations', { params }),
  getFeatured: ()       => api.get('/destinations/featured'),
  getBySlug:   (slug)   => api.get(`/destinations/${slug}`),
};

// ─── Bookings ────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  createTour: (data)  => api.post('/bookings/tour', data),
  getMy:      (params)=> api.get('/bookings/my', { params }),
  getByRef:   (ref)   => api.get(`/bookings/${ref}`),
  cancel:     (ref, data)=> api.post(`/bookings/${ref}/cancel`, data),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  getAll:   (params) => api.get('/reviews', { params }),
  create:   (data)   => api.post('/reviews', data),
  approve:  (id)     => api.patch(`/reviews/${id}/approve`),
  reply:    (id, data)=> api.post(`/reviews/${id}/reply`, data),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersAPI = {
  getProfile:      ()     => api.get('/users/profile'),
  updateProfile:   (data) => api.patch('/users/profile', data),
  changePassword:  (data) => api.patch('/users/change-password', data),
  getWishlist:     ()     => api.get('/users/wishlist'),
  toggleWishlist:  (data) => api.post('/users/wishlist', data),
};

// ─── Packages ────────────────────────────────────────────────────────────────
export const packagesAPI = {
  getAll:     (params) => api.get('/packages', { params }),
  getBySlug:  (slug)   => api.get(`/packages/${slug}`),
};

// ─── AI ──────────────────────────────────────────────────────────────────────
export const aiAPI = {
  generateItinerary:   (data)   => api.post('/ai/trip-planner', data),
  getRecommendations:  (params) => api.get('/ai/recommendations', { params }),
};

// ─── Community ───────────────────────────────────────────────────────────────
export const communityAPI = {
  getStories:     (params) => api.get('/community/stories', { params }),
  getStoryBySlug: (slug)   => api.get(`/community/stories/${slug}`),
  createStory:    (data)   => api.post('/community/stories', data),
  addComment:     (id, data)=> api.post(`/community/stories/${id}/comments`, data),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getOverview:         ()       => api.get('/admin/analytics/overview'),
  getRevenue:          (params) => api.get('/admin/analytics/revenue', { params }),
  getAllBookings:       (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, data)=> api.patch(`/admin/bookings/${id}/status`, data),
  getAllUsers:          (params) => api.get('/admin/users', { params }),
  updateUserStatus:    (id, data)=> api.patch(`/admin/users/${id}/status`, data),
  getPendingReviews:   ()       => api.get('/admin/reviews/pending'),
};

// ─── Newsletter ──────────────────────────────────────────────────────────────
export const newsletterAPI = {
  subscribe:   (data) => api.post('/newsletter/subscribe', data),
  unsubscribe: (data) => api.post('/newsletter/unsubscribe', data),
};

export default api;
