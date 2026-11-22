import { apiClient, USE_MOCK_FALLBACK } from './api';
import { PaymentRequest, PaymentResponse } from '../types/api';

export const paymentService = {
  async processPayment(req: PaymentRequest): Promise<PaymentResponse> {
    try {
      const data = await apiClient<PaymentResponse>('/api/payments', {
        method: 'POST',
        body: JSON.stringify(req),
      });
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        return {
          paymentId: Math.floor(50000 + Math.random() * 50000),
          orderId: req.orderId,
          amount: req.amount,
          paymentStatus: 'SUCCESS',
        };
      }
      throw error;
    }
  },
};
