import { api } from '@/services/api'
import { getStripeJs } from '@/services/stripe-js'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}
export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
    }

    if (session?.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      // Adicione um atraso de 2 segundos após a resposta INP
      await new Promise(resolve => setTimeout(resolve, 3000))
      const { sessionId } = response.data
      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <button
      type="button"
      className={`${styles.subscribeButton} ${styles.layoutShift}`}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
