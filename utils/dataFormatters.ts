export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-IN').format(value);
};

export const formatDate = (timestamp: string | number): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export const formatCompactNumber = (value: number): string => {
    if (value >= 10000000) {
        return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
        return `${(value / 100000).toFixed(2)} L`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(2)} K`;
    }
    return value.toString();
};
