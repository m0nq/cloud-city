export const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;

export type GTagEvent = {
    action: string;
    category: string;
    label?: string;
    value?: number;
};

// Disable analytics for development
export const isProduction = process.env.NODE_ENV === 'production';
