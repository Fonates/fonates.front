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
                    {/* <Image src={'/logo_fonates.svg'} width={34} height={34} alt={'logo ton fonates'} /> */}
                    <Logo />
                    <b>TON Fonates</b>
                </span>
            </Link>
            <div className={styles.headerLinks}>
                <Link href="/articles/quickstart" className={styles.link}>
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