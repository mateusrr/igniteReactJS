import { getPrismicClient } from '@/services/prismic'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { RichText } from 'prismic-dom'
import { ParsedUrlQuery } from 'querystring'

interface Params extends ParsedUrlQuery {
  slug: string
}

interface PostProps {
  posts: {
    slug: string
    title: string
    content: string
    excerpt: string
    updatedAt: string
  }
}

export default function Post({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>{posts.title} | Matnews</title>
      </Head>

      <main>
        <article>
          <h1>{posts.title}</h1>
          <time>{posts.updatedAt}</time>
          <div dangerouslySetInnerHTML={{ __html: posts.content }} />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })
  const { slug } = params as Params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('posts', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  }

  return {
    props: {
      post,
    },
  }
}
