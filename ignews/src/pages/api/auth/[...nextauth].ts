import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { fauna } from '../../../services/fauna'
import { query as q } from 'faunadb'

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session?.user?.email as string),
                    ),
                  ),
                ),
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ]),
          ),
        )

        return { ...session, activeSubscription: userActiveSubscription }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user?.email as string),
                ),
              ),
            ),
            q.Create(q.Collection('users'), { data: { email } }),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user?.email as string),
              ),
            ),
          ),
        )
        return true
      } catch {
        return false
      }
    },
  },
})
