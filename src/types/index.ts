// API Response Types
export interface CurrencyResponse {
  success: boolean;
  source: string[];
  count: number;
  currencies: Record<string, string>;
  lastUpdated: string;
}

export interface RateResponse {
  success: boolean;
  source: string[];
  baseCurrency: string;
  count: number;
  rates: Record<string, number>;
  lastUpdated: string;
  amount?: number;
}

export interface ConversionRequest {
  amount: number;
  from: string;
  to: string;
}

export interface ConversionResponse {
  amount: number;
  from: string;
  to: string;
  converted: number;
  rate: number;
  timestamp: string;
}

// Configuration Types
export interface ApiConfig {
  key?: string;
  baseUrl: string;
  timeout: number;
}

export interface Config {
  server: {
    port: string | undefined;
    env: string;
  };
  apis: {
    exchangeRate: ApiConfig & { key: string };
    frankfurter: ApiConfig;
  };
}

// Error Types
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  timestamp: string;
  statusCode?: number;
}
