import Link from 'next/link';
import styles from './header.module.css';
import { Button, ButtonSize } from 'src/Form/Button';

export const Header = () => {
    return (
        <div className={styles.headerWrapper}>
            <Link href="/" className={styles.logo}>
                <span><b>TON</b> Fonates</span>
            </Link>
            <div className={styles.headerLinks}>
                <Link href="/articles/quickstart" className={styles.link}>
                    Quick start
                </Link>
                <Button type="tertiary" size={ButtonSize.small}>
                    Войти
                </Button>
            </div>
        </div>
    )
}