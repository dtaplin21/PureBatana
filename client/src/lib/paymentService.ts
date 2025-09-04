import { API_ENDPOINTS } from './apiConfig';

export interface PaymentIntentRequest {
  amount: number;
  orderItems: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret: string;
  paymentIntentId: string;
  timestamp: string;
}

export interface CheckoutSessionRequest {
  amount: number;
  orderItems: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  success: boolean;
  sessionId: string;
  url: string;
  timestamp: string;
}

export interface StripeTestResponse {
  success: boolean;
  message: string;
  data?: {
    accountId: string;
    paymentIntentId: string;
    accountName: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
  };
  error?: string;
  timestamp: string;
}

class PaymentService {
  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.error || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  async testStripeConnection(): Promise<StripeTestResponse> {
    return this.makeRequest<StripeTestResponse>(API_ENDPOINTS.STRIPE.TEST);
  }

  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    return this.makeRequest<PaymentIntentResponse>(
      API_ENDPOINTS.STRIPE.CREATE_PAYMENT_INTENT,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    return this.makeRequest<CheckoutSessionResponse>(
      API_ENDPOINTS.STRIPE.CREATE_CHECKOUT_SESSION,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getPaymentIntent(paymentIntentId: string) {
    return this.makeRequest(
      API_ENDPOINTS.STRIPE.GET_PAYMENT_INTENT(paymentIntentId)
    );
  }

  async getCheckoutSession(sessionId: string) {
    return this.makeRequest(
      API_ENDPOINTS.STRIPE.GET_CHECKOUT_SESSION(sessionId)
    );
  }
}

export const paymentService = new PaymentService();
