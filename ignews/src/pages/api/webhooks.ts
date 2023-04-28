/* eslint-disable no-case-declarations */
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { stripe } from '../../services/stripe'
import { saveSubscription } from './_lib/manageSubscription'

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      // eslint-disable-next-line no-unused-vars, no-undef
      event = stripe.webhooks.constructEvent(
        buf,
        secret as string,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${onmessage}`)
    }

    const type = event.type

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.createad':
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
              // type === ('customer.subscription.created' as string),
            )

            break

          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              checkoutSession.subscription?.toString() as string,
              checkoutSession.customer?.toString() as string,
              true,
            )

            break
          default:
            throw new Error('No event.')
        }
      } catch (err) {
        return res.json({ error: 'Webhook handler failed.' })
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(404).end('Method not allowed')
  }
}
