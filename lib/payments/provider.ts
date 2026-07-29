export type PaymentProvider =
  | 'cinetpay'
  | 'fedapay'
  | 'stripe'

export interface CreateCheckoutParams {
  orderId: string
  customerId: string

  plan: string

  amount: number

  currency: string

  customerName?: string

  customerEmail?: string

  customerPhone?: string

  successUrl: string

  cancelUrl: string

  callbackUrl: string
}

export interface CheckoutSession {
  provider: PaymentProvider

  checkoutId: string

  paymentUrl: string
}

export interface PaymentGateway {
  createCheckout(
    params: CreateCheckoutParams
  ): Promise<CheckoutSession>
}