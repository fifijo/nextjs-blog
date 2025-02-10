import { FC } from 'react'
import styles from './Footer.module.css'
import { FooterNav } from './FooterNav'
import { FooterSocial } from './FooterSocial'

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          Acme
          <FooterNav />
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2024 All rights reserved.</p>
          <FooterSocial />
        </div>
      </div>
    </footer>
  )
}
