import { ApiEndpoint } from '@/types/widget';

export const API_BASE_URL = 'https://stock.indianapi.in';
export const API_KEY = 'sk-live-8IYzmJ5IM4cyR67XXZDKn2t6jylZxnaq6UxKsRYb';

export const API_ENDPOINTS: ApiEndpoint[] = [
    {
        id: 'ipo',
        name: 'IPO Data',
        url: '/ipo',
        method: 'GET',
        parameters: [],
        description: 'Get Initial Public Offering (IPO) information',
        category: 'Market Data'
    },
    {
        id: 'news',
        name: 'Market News',
        url: '/news',
        method: 'GET',
        parameters: [],
        description: 'Get latest market news and updates',
        category: 'News'
    },
    {
        id: 'stock',
        name: 'Stock Details',
        url: '/stock',
        method: 'GET',
        parameters: [
            {
                name: 'name',
                type: 'string',
                required: true,
                label: 'Stock Name',
                placeholder: 'e.g., Tata Steel',
                description: 'Enter the stock company name'
            }
        ],
        description: 'Get detailed information about a specific stock',
        category: 'Stocks'
    },
    {
        id: 'trending',
        name: 'Trending Stocks',
        url: '/trending',
        method: 'GET',
        parameters: [],
        description: 'Get currently trending stocks',
        category: 'Market Data'
    },
    {
        id: 'statement',
        name: 'Financial Statement',
        url: '/statement',
        method: 'GET',
        parameters: [
            {
                name: 'stock_name',
                type: 'string',
                required: true,
                label: 'Stock Name',
                placeholder: 'e.g., Reliance'
            },
            {
                name: 'stats',
                type: 'string',
                required: true,
                label: 'Statistics Type',
                placeholder: 'e.g., income, balance'
            }
        ],
        description: 'Get financial statements for a stock',
        category: 'Financials'
    },
    {
        id: 'commodities',
        name: 'Commodities',
        url: '/commodities',
        method: 'GET',
        parameters: [],
        description: 'Get commodity market data',
        category: 'Commodities'
    },
    {
        id: 'mutual_funds',
        name: 'Mutual Funds',
        url: '/mutual_funds',
        method: 'GET',
        parameters: [],
        description: 'Get mutual funds information',
        category: 'Funds'
    },
    {
        id: 'price_shockers',
        name: 'Price Shockers',
        url: '/price_shockers',
        method: 'GET',
        parameters: [],
        description: 'Get stocks with significant price movements',
        category: 'Market Data'
    },
    {
        id: 'bse_most_active',
        name: 'BSE Most Active',
        url: '/BSE_most_active',
        method: 'GET',
        parameters: [],
        description: 'Get most active stocks on BSE',
        category: 'Market Data'
    },
    {
        id: 'nse_most_active',
        name: 'NSE Most Active',
        url: '/NSE_most_active',
        method: 'GET',
        parameters: [],
        description: 'Get most active stocks on NSE',
        category: 'Market Data'
    },
    {
        id: 'historical_data',
        name: 'Historical Stock Data',
        url: '/historical_data',
        method: 'GET',
        parameters: [
            {
                name: 'stock_name',
                type: 'string',
                required: true,
                label: 'Stock Name',
                placeholder: 'e.g., HDFC Bank'
            },
            {
                name: 'period',
                type: 'select',
                required: false,
                label: 'Period',
                options: ['1m', '3m', '6m', '1y', '5y'],
                placeholder: '1m'
            },
            {
                name: 'filter',
                type: 'string',
                required: false,
                label: 'Filter',
                placeholder: 'default'
            }
        ],
        description: 'Get historical stock price data',
        category: 'Historical'
    },
    {
        id: 'industry_search',
        name: 'Industry Search',
        url: '/industry_search',
        method: 'GET',
        parameters: [
            {
                name: 'query',
                type: 'string',
                required: true,
                label: 'Search Query',
                placeholder: 'e.g., Technology'
            }
        ],
        description: 'Search stocks by industry',
        category: 'Search'
    },
    {
        id: 'stock_forecasts',
        name: 'Stock Forecasts',
        url: '/stock_forecasts',
        method: 'GET',
        parameters: [
            {
                name: 'stock_id',
                type: 'string',
                required: true,
                label: 'Stock ID',
                placeholder: 'Stock identifier'
            },
            {
                name: 'measure_code',
                type: 'select',
                required: false,
                label: 'Measure',
                options: ['EPS', 'Revenue', 'EBITDA'],
                placeholder: 'EPS'
            },
            {
                name: 'period_type',
                type: 'select',
                required: false,
                label: 'Period Type',
                options: ['Annual', 'Quarterly'],
                placeholder: 'Annual'
            },
            {
                name: 'data_type',
                type: 'select',
                required: false,
                label: 'Data Type',
                options: ['Actuals', 'Estimates'],
                placeholder: 'Actuals'
            },
            {
                name: 'age',
                type: 'select',
                required: false,
                label: 'Age',
                options: ['OneWeekAgo', 'OneMonthAgo'],
                placeholder: 'OneWeekAgo'
            }
        ],
        description: 'Get stock forecasts and estimates',
        category: 'Analysis'
    },
    {
        id: 'historical_stats',
        name: 'Historical Statistics',
        url: '/historical_stats',
        method: 'GET',
        parameters: [
            {
                name: 'stock_name',
                type: 'string',
                required: true,
                label: 'Stock Name',
                placeholder: 'e.g., Infosys'
            },
            {
                name: 'stats',
                type: 'string',
                required: true,
                label: 'Statistics Type',
                placeholder: 'e.g., volume, price'
            }
        ],
        description: 'Get historical statistics for a stock',
        category: 'Historical'
    },
    {
        id: 'corporate_actions',
        name: 'Corporate Actions',
        url: '/corporate_actions',
        method: 'GET',
        parameters: [
            {
                name: 'stock_name',
                type: 'string',
                required: true,
                label: 'Stock Name',
                placeholder: 'e.g., TCS'
            }
        ],
        description: 'Get corporate actions for a stock',
        category: 'Corporate'
    },
    {
        id: 'mutual_fund_search',
        name: 'Mutual Fund Search',
        url: '/mutual_fund_search',
        method: 'GET',
        parameters: [
            {
                name: 'query',
                type: 'string',
                required: true,
                label: 'Search Query',
                placeholder: 'e.g., SBI Bluechip'
            }
        ],
        description: 'Search for mutual funds',
        category: 'Search'
    },
    {
        id: 'stock_target_price',
        name: 'Stock Target Price',
        url: '/stock_target_price',
        method: 'GET',
        parameters: [
            {
                name: 'stock_id',
                type: 'string',
                required: true,
                label: 'Stock ID',
                placeholder: 'Stock identifier'
            }
        ],
        description: 'Get analyst target prices for a stock',
        category: 'Analysis'
    },
    {
        id: 'mutual_funds_details',
        name: 'Mutual Fund Details',
        url: '/mutual_funds_details',
        method: 'GET',
        parameters: [
            {
                name: 'stock_name',
                type: 'string',
                required: true,
                label: 'Fund Name',
                placeholder: 'Mutual fund name'
            }
        ],
        description: 'Get detailed mutual fund information',
        category: 'Funds'
    },
    {
        id: 'recent_announcements',
        name: 'Recent Announcements',
        url: '/recent_announcements',
        method: 'GET',
        parameters: [
            {
                name: 'stock_name',
                type: 'string',
                required: true,
                label: 'Stock Name',
                placeholder: 'e.g., Wipro'
            }
        ],
        description: 'Get recent company announcements',
        category: 'News'
    },
    {
        id: '52_week_high_low',
        name: '52 Week High/Low',
        url: '/fetch_52_week_high_low_data',
        method: 'GET',
        parameters: [],
        description: 'Get stocks at 52-week highs and lows',
        category: 'Market Data'
    }
];
