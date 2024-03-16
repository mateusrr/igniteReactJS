/* eslint-disable @next/next/no-html-link-for-pages */
import styles from './styles.module.scss'
import Image from 'next/image'
import { SignInButton } from '../SignInButton'
import { ActiveLink } from '../ActiveLink'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/logo.svg" alt="ig.news" width={100} height={100} />

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            Home
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            Posts
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}
