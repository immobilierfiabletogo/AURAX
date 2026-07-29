import { PaymentGateway } from './provider'

import { CinetPayGateway } from './providers/cinetpay'

const provider =
  process.env.PAYMENT_PROVIDER ?? 'cinetpay'

export function getPaymentGateway(): PaymentGateway {
  switch (provider) {
    case 'cinetpay':
      return new CinetPayGateway()

    default:
      throw new Error(
        'Unsupported payment provider'
      )
  }
}