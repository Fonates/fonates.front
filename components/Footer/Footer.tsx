import Link from 'next/link';
import styles from './footer.module.css';

export const Footer = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.leftSide}>
                <span>Base on <b>TON</b></span>
            </div>
            <div className={styles.middleSide}>
                <Link href="https://t.me/fonates">
                    Telegram
                </Link>
                {/* <span className={styles.separator}></span> */}
                <Link href="https://t.me/pewpells">
                    Support
                </Link>
            </div>
            <div className={styles.rightSide}>
                <span>© 2024 TON Fonates</span>
            </div>
        </div>
    )
};