import Link from 'next/link';
import styles from './header.module.css';

export const Header = () => {
    return (
        <div className={styles.headerWrapper}>
            <Link href="/" className={styles.logo}>
                <span><b>TON</b> Fonates</span>
            </Link>
            <div className={styles.headerLinks}>
                <Link href="/articles/quickstart">
                    Quick start
                </Link>
            </div>
        </div>
    )
}