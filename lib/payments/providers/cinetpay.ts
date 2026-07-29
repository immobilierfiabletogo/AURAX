import {
  CheckoutSession,
  CreateCheckoutParams,
  PaymentGateway,
} from '../provider'

export class CinetPayGateway
  implements PaymentGateway
{
  async createCheckout(
    params: CreateCheckoutParams
  ): Promise<CheckoutSession> {

    /*
      Ici sera appelé l'API officielle CinetPay.

      Cette première version prépare simplement
      l'architecture.
    */

    return {
      provider: 'cinetpay',

      checkoutId: crypto.randomUUID(),

      paymentUrl:
        'https://checkout.cinetpay.com',
    }
  }
}