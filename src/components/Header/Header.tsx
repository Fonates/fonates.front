import Link from 'next/link';
import styles from './header.module.css';
import { Button, ButtonSize } from '../../Form/Button';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { sliceWalletAddress } from '../../utils/sliceAddress';
import Logo from '@/assets/icons/logo_fonates.svg';

interface HeaderProps {
    walletAddress?: string;
};

export const Header = ({ walletAddress }: HeaderProps) => {
    const { open } = useTonConnectModal();

    return (
        <div className={styles.headerWrapper}>
            <Link href="/" className={styles.logo}>
                <span>
                    <Logo />
                    <b>TON Fonates</b>
                </span>
            </Link>
            <div className={styles.headerLinks}>
                <Link href="/constructor" className={styles.link}>
                    Конструктор
                </Link>
                <Link href="/articles/quick" className={styles.link}>
                    Быстрый старт
                </Link>
                {walletAddress ? (
                    <Button type="tertiary" size={ButtonSize.small} onClick={open}>
                        {sliceWalletAddress(walletAddress, 4)}
                    </Button>
                ) : (
                    <Button type="tertiary" size={ButtonSize.small} onClick={open}>
                        Войти
                    </Button>
                )}
            </div>
        </div>
    )
}