/**
 * ==============================================
 * O.N.Precision API Client
 * ==============================================
 * Module để gọi API từ frontend
 */

const API = {
    baseUrl: '/api',

    /**
     * Fetch wrapper với error handling
     */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: { 'Content-Type': 'application/json', ...options.headers },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ==============================================
    // Products API
    // ==============================================
    products: {
        async getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return API.request(`/products${query ? '?' + query : ''}`);
        },

        async getFeatured(limit = 6) {
            return API.request(`/products/featured?limit=${limit}`);
        },

        async getById(id) {
            return API.request(`/products/${id}`);
        }
    },

    // ==============================================
    // News API
    // ==============================================
    news: {
        async getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return API.request(`/news${query ? '?' + query : ''}`);
        },

        async getLatest(limit = 3) {
            return API.request(`/news/latest?limit=${limit}`);
        },

        async getById(id) {
            return API.request(`/news/${id}`);
        }
    }
};

// Export cho browser
if (typeof window !== 'undefined') {
    window.API = API;
}
