/* eslint-disable prettier/prettier */
import { fauna } from '@/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { stripe } from '../../services/stripe'
import { query as q } from 'faunadb'

type User = {
  ref: {
    id: string
  }

  ts: {
    id: string
  }

  data: {
    stripe_customer_id: string
  }
}

export default async function subscriber(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    // eslint-disable-next-line no-unused-vars
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session?.user?.email as string),
        ),
      ),
    )
    

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email as string,
      })

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        }),
      )
      
      customerId = stripeCustomer.id
    }

    // First Input Delay (FID): Introduza um atraso deliberado antes de retornar a resposta.
    // Você pode usar setTimeout para simular um atraso de 1 segundo
    setTimeout(async () => {
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [{ price: 'price_1NGA6XKtkYnvMb7EHLnfFNp0', quantity: 1 }],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL as string,
        cancel_url: process.env.STRIPE_CANCEL_URL as string,
      })
  
      return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    }, 3000)
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}