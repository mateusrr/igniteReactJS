// eslint-disable-next-line no-unused-vars
import { NextAuth } from 'next-auth/next'

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    activeSubscription: string | null
  }
}
