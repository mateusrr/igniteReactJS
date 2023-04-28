import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import { signIn, useSession } from 'next-auth/react'
// import { stripe } from '../../services/stripe'
import styles from './styles.module.scss'
import { useRouter } from 'next/router'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscriber() {
    if (!session) {
      signIn('github')
    }

    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscriber')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error: any) {
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
