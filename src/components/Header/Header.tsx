import Link from 'next/link';
import styles from './header.module.css';
import { Button, ButtonSize } from '../../Form/Button';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { sliceWalletAddress } from '../../utils/sliceAddress';
import Logo from '@/assets/icons/logo_fonates.svg';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Fragment } from 'react';
import { Avatar, AvatarSize } from '../Avatar';
import { Dropdown } from '../DropdownMenuBurger';
import { deleteCookie } from 'cookies-next';
import { CookiesStoreKeyAuth } from '@/hooks/useBackendAuth';

interface HeaderProps {
    walletAddress?: string;
};

export const Header = ({ walletAddress }: HeaderProps) => {
    const { open } = useTonConnectModal();
    const isMobileWidth = useMediaQuery('(max-width: 500px)')

    const logout = () => {
        console.log('logout');
        deleteCookie(CookiesStoreKeyAuth);
        window.location.reload();
    }

    const arrayElementsDropdown = [{
        name: 'Logout',
        value: '',
        onClick: logout,
    }];

    return (
        <div className={styles.headerWrapper}>
            <Link href="/" className={styles.logo}>
                <span>
                    <Logo />
                    <b>TON Fonates</b>
                </span>
            </Link>
            <div className={styles.headerLinks}>
                {!isMobileWidth && (
                    <Fragment>
                        <Link href="/constructor" className={styles.link}>
                            Constructor
                        </Link>
                        <Link href="/articles/quick" className={styles.link}>
                            Quick Start
                        </Link>
                    </Fragment>
                )}
                {walletAddress ? (
                    <Dropdown arrayInfo={arrayElementsDropdown}>
                        <Button 
                            type="tertiary"
                            isOutline 
                            size={ButtonSize.small}
                        >
                            <div className={styles.headerAccountInfo}>
                                <span className={styles.iconAccountInfo}>
                                    <Avatar username={walletAddress} size={AvatarSize.small} /> 
                                    {sliceWalletAddress(walletAddress, 4)}
                                </span>
                            </div>
                        </Button>
                    </Dropdown>
                ) : (
                    <Button type="tertiary" size={ButtonSize.small} onClick={open}>
                        Login
                    </Button>
                )}
            </div>
        </div>
    )
}
