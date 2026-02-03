import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stock.indianapi.in';
// Prefer server-only env var (INDIAN_STOCK_API_KEY) and fall back to NEXT_PUBLIC if not set
const API_KEY = process.env.INDIAN_STOCK_API_KEY || process.env.NEXT_PUBLIC_INDIAN_STOCK_API_KEY;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const endpoint = searchParams.get('endpoint');

        if (!endpoint) {
            return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
        }

        // Build target URL
        const targetUrl = new URL(`${API_BASE_URL}${endpoint}`);

        // Forward other query params
        for (const [key, value] of searchParams.entries()) {
            if (key === 'endpoint') continue;
            if (value) targetUrl.searchParams.append(key, value);
        }

        const res = await fetch(targetUrl.toString(), {
            method: 'GET',
            headers: {
                ...(API_KEY && { 'X-Api-Key': API_KEY }),
            },
        });

        const body = await res.text();

        // Try to parse JSON, otherwise return text
        try {
            const json = JSON.parse(body);
            return NextResponse.json(json, { status: res.status });
        } catch (e) {
            return new NextResponse(body, { status: res.status });
        }
    } catch (err) {
        console.error('Proxy error:', err);
        return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
    }
}
