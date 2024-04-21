import ApiTonAuth from "@/API/auth";
import { BackendTokenContext } from "@/contexts/backendTokenContext";
import { useIsConnectionRestored, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { getCookie, setCookie } from "cookies-next";
import { useContext, useEffect, useRef } from "react";

export const CookiesStoreKeyAuth = 'my-dapp-auth-token';
const payloadTTLMS = 1000 * 60 * 20;
const TTLMS_TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10;

const backendAuth = new ApiTonAuth({
    baseURL: process.env.NEXT_PUBLIC_API_URL_V1 || '',
    headers: {},
});

export function useBackendAuth() {
    const { setToken } = useContext(BackendTokenContext);
    const isConnectionRestored = useIsConnectionRestored();
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const interval = useRef<ReturnType<typeof setInterval> | undefined>();

    useEffect(() => {
        if (!isConnectionRestored || !setToken) {
            return;
        }

        clearInterval(interval.current);

        if (!wallet) {
            
            setToken(null);

            const refreshPayload = async () => {
                tonConnectUI.setConnectRequestParameters({ state: 'loading' });

                const value = await backendAuth.GeneratePayload();
                if (!value) {
                    tonConnectUI.setConnectRequestParameters(null);
                } else {
                    tonConnectUI.setConnectRequestParameters({state: 'ready', value: {
                        tonProof: value,
                    }});
                }
            }  

            refreshPayload();
            setInterval(refreshPayload, payloadTTLMS);
            return;
        }

        const token = getCookie(CookiesStoreKeyAuth) as string;
        if (token) {
            setToken(token);
            return;
        }

        if (wallet.connectItems?.tonProof && !('error' in wallet.connectItems.tonProof)) {
            backendAuth.CheckProof(wallet.connectItems.tonProof.proof, wallet.account).then(result => {
                if (result) {
                    setToken(result);
                    setCookie(CookiesStoreKeyAuth, result, { path: '/', expires: new Date(Date.now() + payloadTTLMS)});
                    window.location.reload();
                } else {
                    alert('Please try another wallet');
                    tonConnectUI.disconnect();
                }
            })
        } else {
            console.error('Try another wallet')
            tonConnectUI.disconnect();
        }

    }, [wallet, isConnectionRestored, setToken])
}