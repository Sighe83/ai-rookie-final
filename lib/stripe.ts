import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export interface CreatePaymentIntentParams {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent({
  amount,
  currency = 'dkk',
  metadata = {},
}: CreatePaymentIntentParams) {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    capture_method: 'manual', // Don't capture until expert accepts
    metadata,
  })
}

export async function capturePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.capture(paymentIntentId)
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.cancel(paymentIntentId)
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  })
}
