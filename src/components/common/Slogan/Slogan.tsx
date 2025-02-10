import { FC } from 'react';
import styles from './Slogan.module.css';

interface SloganDTO {
  text: string;
  className?: string;
}

const Slogan: FC<SloganDTO> = ({
  text,
  className = '',
}) => {
  return (
    <div
      className={`${styles.container} ${className}`}
    >
      <h2 className={styles.title}>{text}</h2>
    </div>
  );
};

export default Slogan;
