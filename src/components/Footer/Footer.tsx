import Link from 'next/link';
import styles from './footer.module.css';

export const Footer = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.middleSide}>
                    <p>Social Media</p>
                    <Link href="https://t.me/fonates">
                        Telegram
                    </Link>
                    {/* <Link href="https://t.me/fonateschat">
                        Telegram Chat
                    </Link> */}
                    {/* <Link href="https://vk.com/fonates">
                        Vkontakte
                    </Link> */}
                    <Link href="https://twitter.com/TFonates">
                        Twitter
                    </Link>
                    {/* <Link href="https://discord.gg/qRBv5TVVPA">
                        Discord
                    </Link> */}
                    <Link href="https://youtube.com/@fonates">
                        YouTube
                    </Link>
                </div>
                <div className={styles.middleSide}>
                    <p>Service</p>
                    <Link href="https://t.me/pewpells">
                        Support
                    </Link>
                    <Link href="https://t.me/thepettruha">
                        For Partners
                    </Link>
                </div>
                <div className={styles.middleSide}>
                    <p>Articles</p>
                    <Link href="https://fonates.com/articles/quick">
                        Quick Start
                    </Link>
                    <Link href="https://fonates.com/articles/how-it-is-work">
                        How It Works?
                    </Link>
                    <Link href="https://fonates.com/articles/roadmap">
                        Roadmap
                    </Link>
                </div>
            </div>
            <div className={styles.product}>
                <div className={styles.leftSide}>
                    <span>Based on <b>TON</b></span>
                </div>
                <div className={styles.rightSide}>
                    <span>© 2024 TON Fonates</span>
                </div>
            </div>
        </div>
    )
};
