import axios from 'axios';

let auth: any = null;

if (typeof window !== 'undefined') {
    import('@/lib/firebase').then((firebase) => {
        auth = firebase.auth;
    });
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://love-app-production.up.railway.app/api';
//const API_URL = 'http://localhost:5000/api';

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

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Token expirado o inválido');
        }
        return Promise.reject(error);
    }
);

export default apiClient;

export const api = {
    auth: {
        getMe: () => apiClient.get('/auth/me'),
        syncUser: (data: any) => apiClient.post('/auth/sync', data),
        updateProfile: (data: any) => apiClient.patch('/auth/profile', data),
        deleteAccount: () => apiClient.delete('/auth/account'),
    },

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
        checkSlug: (slug: string) => apiClient.get(`/pages/check-slug/${slug}`),
    },

    payments: {
        createMercadoPagoPayment: () => apiClient.post('/payments/mercadopago/create-preference'),
        createPayPalOrder: () => apiClient.post('/payments/paypal/create-order'),
        capturePayPalPayment: (orderId: string) => apiClient.post(`/payments/paypal/capture/${orderId}`),
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
        getAllMessages: (params?: any) => apiClient.get('/contact/admin/all', { params }),
        updateStatus: (id: string, data: any) => apiClient.patch(`/contact/admin/${id}`, data),
        getMyMessage: (contactId: string) => apiClient.get(`/contact/${contactId}`),
    },
    rewards: {
        requestReward: () =>
            apiClient.post('/rewards/request'),
        confirmReward: (token: string) =>
            apiClient.post('/rewards/confirm', { token }),
        getStatus: () =>
            apiClient.get('/rewards/status'),
    },
    notifications: {
        getAll: (params?: any) =>
            apiClient.get('/notifications', { params }),
        getUnreadCount: () =>
            apiClient.get('/notifications/unread-count'),
        markAsRead: (notificationId: string) =>
            apiClient.patch(`/notifications/${notificationId}/read`),
        markAllAsRead: () =>
            apiClient.patch('/notifications/read-all'),
        // Web Push
        getVapidPublicKey: () =>
            apiClient.get('/notifications/push/vapid-public-key'),
        subscribePush: (subscription: any) =>
            apiClient.post('/notifications/push/subscribe', { subscription }),
        unsubscribePush: (data: { endpoint: string }) =>
            apiClient.delete('/notifications/push/unsubscribe', { data }),
    },
    templates: {
        // Listar plantillas activas (público)
        getAll: (category?: string) =>
            apiClient.get('/templates', { params: category ? { category } : {} }),

        // Obtener plantilla por ID (con HTML/CSS)
        getById: (templateId: string) =>
            apiClient.get(`/templates/${templateId}`),

        // Renderizar plantilla con valores custom (preview)
        render: (templateId: string, values: Record<string, string>) =>
            apiClient.post(`/templates/${templateId}/render`, { values }),

        // 🆕 Subir imagen para un campo de plantilla (requiere PRO)
        uploadImage: (templateId: string, formData: FormData) =>
            apiClient.post(`/templates/${templateId}/upload-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),

        // Crear página desde plantilla (PRO)
        createPage: (templateId: string, data: {
            values: Record<string, string>;
            recipientName: string;
            yesButtonText?: string;
            noButtonText?: string;
            noButtonEscapes?: boolean;
            customSlug?: string;
        }) => apiClient.post(`/templates/${templateId}/create-page`, data),
    },
};