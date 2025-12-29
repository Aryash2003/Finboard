import { API_BASE_URL, API_KEY } from '@/config/api-endpoints';

interface FetchApiOptions {
    url: string;
    params?: Record<string, string>;
}

export class ApiService {
    private static cache: Map<string, { data: any; timestamp: number }> = new Map();
    private static CACHE_DURATION = 30000; // 30 seconds

    static async fetchData({ url, params = {} }: FetchApiOptions): Promise<any> {
        const fullUrl = this.buildUrl(url, params);
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
                    ...(API_KEY && { 'X-Api-Key': API_KEY }),
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
