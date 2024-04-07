import ApiTonAuth from "@/API/auth";
import { BackendTokenContext } from "@/contexts/backendTokenContext";
import { useIsConnectionRestored, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useContext, useEffect, useRef } from "react";

const localStorageKey = 'my-dapp-auth-token';
const payloadTTLMS = 1000 * 60 * 20;

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
            localStorage.removeItem(localStorageKey);
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

        const token = localStorage.getItem(localStorageKey);
        if (token) {
            setToken(token);
            return;
        }

        if (wallet.connectItems?.tonProof && !('error' in wallet.connectItems.tonProof)) {
            backendAuth.CheckProof(wallet.connectItems.tonProof.proof, wallet.account).then(result => {
                if (result) {
                    console.log('CheckProof', result)
                    setToken(result);
                    localStorage.setItem(localStorageKey, result);
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