import { CookiesStoreKeyAuth } from '@/hooks/useBackendAuth';
import styles from './style.module.css';
import ApiLinks from '@/API/links';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import ApiDonates from '@/API/donate';

const apiLinks = new ApiLinks({
    baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
    headers: {},
});

const apiDonates = new ApiDonates({
    baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
    headers: {},
});

export interface IAlert {
    key?: string;
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
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0, animationDelay: `${props.index * 0.3}s`}}
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
    const [dataStream, setDataStream] = useState<IAlert>();
    const [isMounted, setIsMounted] = useState(false);

    const requestDonationLink = async (): Promise<boolean | undefined> => {
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
        return true
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

    const addAlert = (alert: IAlert) => {
        const key = (Math.random()
            .toString(36)
            .substring(2, 15) + Math.random()
            .toString(36)
            .substring(2, 15)
        );
        
        setArrayAlerts((prevAlerts: IAlert[]) => [...prevAlerts, {
            ...alert,
            key: key,
            index: prevAlerts.length,
        }]);

        const delay = 50 * alert.message.length;
        const t = (delay + 3000) * arrayAlerts.length; 

        setTimeout(() => {
            handlerUpadteAlert(key, true)

            setTimeout(() => {
                handlerUpadteAlert(key, false)
                handlerRemoveAlert(key);
            }, (delay + 3000))
        }, t)
    };

    const streamingAlert = async (slug: string) => {    
        apiDonates.SSEStreaming(slug, (event) => {
            const data = event.data === 'heartbeat' ? {} : JSON.parse(event.data);
            if (!data?.username || !data?.amount) {
                return;
            }

            setDataStream({
                amountInTon: Number(data.amount) / 1000000000,
                username: data.username,
                message: data?.comment?.length > 0 ? data.comment : '',
                isVisible: false,
                index: 0
            })
        })
    }

    useEffect(() => {
        if (!window.obsstudio) {
            return;
        }

        const token = getCookie(CookiesStoreKeyAuth);
        if (!token) tonConnectUI.openModal();
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !dataStream) return;
        addAlert(dataStream);
    }, [dataStream])

    useEffect(() => {
        const slug = String(slug_donate || '');
        if (!isMounted || slug === '') return;

        requestDonationLink().then(isActivated => {
            if (!isActivated) return;
            streamingAlert(slug)
        });
    }, [isMounted])

    if (!window.obsstudio) {
        return null;
    }

    return (
        <div className={styles.wpAlert} onClick={() => addAlert({
            amountInTon: 10000000 / 1000000000,
            username: 'Fonates',
            message: 'Test message',
            isVisible: false,
            index: 0
        })}>
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