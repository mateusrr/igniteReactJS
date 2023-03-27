import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import { signIn, useSession } from 'next-auth/react'
// import { stripe } from '../../services/stripe'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession()

  async function handleSubscriber() {
    if (!session) {
      signIn('github')
    }

    try {
      const response = await api.post('/subscriber')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscriber}
    >
      Subscribe now
    </button>
  )
}
