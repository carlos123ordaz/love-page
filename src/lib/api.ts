import axios from 'axios';

// Usar importación dinámica para auth para evitar errores de tipo
let auth: any = null;

if (typeof window !== 'undefined') {
    import('@/lib/firebase').then((firebase) => {
        auth = firebase.auth;
    });
}

//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://love-app-production.up.railway.app/api';
const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
    async (config) => {
        if (typeof window !== 'undefined' && auth?.currentUser) {
            try {
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error getting token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            console.error('Token expirado o inválido');
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// API Helpers
export const api = {
    // Auth
    auth: {
        getMe: () => apiClient.get('/auth/me'),
        syncUser: (data: any) => apiClient.post('/auth/sync', data),
        updateProfile: (data: any) => apiClient.patch('/auth/profile', data),
        deleteAccount: () => apiClient.delete('/auth/account'),
    },

    // Pages
    pages: {
        create: (data: FormData) =>
            apiClient.post('/pages', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        getMyPages: (params?: any) => apiClient.get('/pages/my-pages', { params }),
        getById: (pageId: string) => apiClient.get(`/pages/${pageId}/details`),
        getByShortId: (shortId: string) => apiClient.get(`/pages/public/${shortId}`),
        respond: (shortId: string, answer: 'yes' | 'no') =>
            apiClient.post(`/pages/public/${shortId}/respond`, { answer }),
        getDetails: (pageId: string) => apiClient.get(`/pages/${pageId}/details`),
        update: (pageId: string, data: any) => apiClient.patch(`/pages/${pageId}`, data),
        delete: (pageId: string) => apiClient.delete(`/pages/${pageId}`),
        toggleStatus: (pageId: string) => apiClient.patch(`/pages/${pageId}/toggle`),
        getStats: () => apiClient.get('/pages/stats'),
    },

    // Payments
    payments: {
        createProPayment: () => apiClient.post('/payments/create-preference'),
        createPreference: () => apiClient.post('/payments/create-preference'),
        checkStatus: (paymentId: string) => apiClient.get(`/payments/${paymentId}/status`),
        getHistory: () => apiClient.get('/payments/history'),
        simulateSuccess: () => apiClient.post('/payments/simulate-success'),
    },
    contact: {
        create: (data: any) => apiClient.post('/contact', data),
        getMyMessages: () => apiClient.get('/contact/my-messages'),
        getMessage: (id: string) => apiClient.get(`/contact/${id}`),
        // Admin routes (si necesitas panel de admin)
        getAllMessages: (params?: any) => apiClient.get('/contact/admin/all', { params }),
        updateStatus: (id: string, data: any) => apiClient.patch(`/contact/admin/${id}`, data),
    },
};