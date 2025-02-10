'use client';

import Slogan from '@/components/common/Slogan/Slogan';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <h1>Blog</h1>
        <Slogan
          text="Exploring Ideas, Sharing Stories"
          className={styles.slogan}
        />
      </div>
    </header>
  );
};
