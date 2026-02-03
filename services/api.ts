
import { API_BASE_URL } from '@/config/api-endpoints';

interface FetchApiOptions {
    url: string;
    params?: Record<string, string>;
}

export class ApiService {
    private static cache: Map<string, { data: any; timestamp: number }> = new Map();
    private static CACHE_DURATION = 30000; // 30 seconds

    static async fetchData({ url, params = {} }: FetchApiOptions): Promise<any> {
        // Route requests through a local proxy to avoid CORS and expose the API key only on the server
        const origin = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
        const proxyUrl = new URL('/api/proxy', origin);
        proxyUrl.searchParams.append('endpoint', url);
        Object.entries(params).forEach(([key, value]) => {
            if (value) proxyUrl.searchParams.append(key, value);
        });

        const fullUrl = proxyUrl.toString();
        const cacheKey = fullUrl;

        // Check cache
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Cache the response
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now(),
            });

            return data;
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    private static buildUrl(endpoint: string, params: Record<string, string>): string {
        const url = new URL(`${API_BASE_URL}${endpoint}`);

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                url.searchParams.append(key, value);
            }
        });

        return url.toString();
    }

    static clearCache(url?: string) {
        if (url) {
            this.cache.delete(url);
        } else {
            this.cache.clear();
        }
    }
}
