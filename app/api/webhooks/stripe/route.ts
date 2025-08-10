import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const payment = await db.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: { booking: true },
  })

  if (!payment) {
    console.error('Payment not found for payment intent:', paymentIntent.id)
    return
  }

  await db.payment.update({
    where: { id: payment.id },
    data: { status: 'PAID' },
  })

  // Update booking status if payment was captured
  if (paymentIntent.status === 'succeeded') {
    await db.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' },
    })
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const payment = await db.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: { booking: true },
  })

  if (!payment) {
    console.error('Payment not found for payment intent:', paymentIntent.id)
    return
  }

  // Mark booking as cancelled and payment as failed
  await db.$transaction([
    db.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    }),
    db.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CANCELLED' },
    }),
  ])
}