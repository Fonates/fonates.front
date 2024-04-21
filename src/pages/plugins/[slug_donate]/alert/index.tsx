import { CookiesStoreKeyAuth } from '@/hooks/useBackendAuth';
import styles from './style.module.css';
import ApiLinks from '@/API/links';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"

const apiLinks = new ApiLinks({
    baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
    headers: {},
});

interface IAlert {
    key: string;
    index: number;
    amountInTon: number;
    username: string;
    message: string;
    isVisible: boolean;
    position?: {
        zIndex: number;
        x: number;
        y: number;
    };
}

const DURATION_ALERT = 500;

export const Alert: React.FC<IAlert> = (props) => {
    const {
        amountInTon,
        username,
        message,
        isVisible,
        position
    } = props;
    return (
        <motion.div
            style={position ? { zIndex: position.zIndex, top: position.y, left: position.x } : {}}
            className={styles.alertContainer}
            initial={{ opacity: 0, scale: 0.0 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
            transition={{ duration: DURATION_ALERT / 1000 }}
        >
            <div className={styles.alertHeader}>
                <span className={styles.username}>{username}</span>
                <span className={styles.amount}>{amountInTon} TON</span>
            </div>
            <div className={styles.alertMessage}>
                {message}
            </div>
        </motion.div>
    )
}

const PagePluginAlert = () => {
    const router = useRouter();
    const { slug_donate } = router.query || {};
    const [tonConnectUI] = useTonConnectUI();
    const [arrayAlerts, setArrayAlerts] = useState<IAlert[]>([]);

    console.log('slug_donate', arrayAlerts);

    const requestDonationLink = async () => {
        const token = getCookie(CookiesStoreKeyAuth);
        if (!token) return;

        const result = await apiLinks.GetLinkStatus(slug_donate as string);
        if (!result?.status || result?.status === 'active') {
            return;
        }
    
        const keyActivation = await apiLinks.GetKeyActivation(slug_donate as string)
        if (!keyActivation?.status || keyActivation?.status === 'active') {
            return;
        }

        const activate = await apiLinks.ActivateLink(slug_donate as string, keyActivation?.key);
        if (!activate?.status || activate?.status !== 'ok') {
            return;
        }

        console.log('Link activated');
    }

    const handlerUpadteAlert = (key: string, isVisible: boolean) => {
        setArrayAlerts((prevAlerts) => prevAlerts.map((alert) => {
            if (alert.key === key) {
                return {
                    ...alert,
                    isVisible,
                }
            }

            return alert;
        }));
    };

    const handlerRemoveAlert = (key: string) => {
        setTimeout(() => {
            setArrayAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.key !== key));
        }, DURATION_ALERT)
    }

    const addAlert = () => {
        const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        setArrayAlerts((prevAlerts: IAlert[]) => [...prevAlerts, {
            key, 
            isVisible: false,
            amountInTon: 1,
            username: 'TheBrainDit',
            message: 'Когда новое прохождение?',
            index: prevAlerts.length,
        }]);

        setTimeout(() => {
            handlerUpadteAlert(key, true)

            setTimeout(() => {
                handlerUpadteAlert(key, false)
                handlerRemoveAlert(key);
            }, 3000)
        }, 3000 * arrayAlerts.length)
    };

    useEffect(() => {
        // if (!window.obsstudio) {
        //     return;
        // }

        requestDonationLink();
    }, [slug_donate]);

    useEffect(() => {
        // if (!window.obsstudio) {
        //     return;
        // }

        const token = getCookie(CookiesStoreKeyAuth);
        if (!token) tonConnectUI.openModal();
    }, []);

    // if (!window.obsstudio) {
    //     return null;
    // }

    return (
        <div className={styles.wpAlert} onClick={addAlert}>
            <div className={styles.alert}>
                {arrayAlerts.map((alert, index) => (
                    <Alert
                        key={alert.key}
                        index={alert.index}
                        isVisible={alert.isVisible}
                        amountInTon={alert.amountInTon}
                        username={alert.username}
                        message={alert.message}
                    />
                ))}
            </div>
        </div>
    )
};

export default PagePluginAlert;