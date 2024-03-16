import { stripe } from '@/services/stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
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

const revelantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)

    const secret = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret as string,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      )
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    const type = event.type

    if (revelantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            // eslint-disable-next-line no-case-declarations
            const subscription = event.data.object as Stripe.Checkout.Session

            await saveSubscription(
              subscription.id,
              subscription.customer?.toString() as string,
              false,
              // type === 'customer.subscription.created',
            )
            break
          case 'checkout.session.completed':
            // eslint-disable-next-line no-case-declarations
            const checkoutSession = event.data.object as Stripe.Checkout.Session
            await saveSubscription(
              checkoutSession.subscription?.toString() as string,
              checkoutSession.customer?.toString() as string,
              true,
            )
            break
          default:
            throw new Error('Unhandled event.')
        }
      } catch (err) {
        return res.json({ err: 'Weboook handler failed.' })
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
