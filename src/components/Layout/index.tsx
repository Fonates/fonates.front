import { Fragment, useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useBackendAuth } from "@/hooks/useBackendAuth";
import { useRouter } from "next/router";

export const Layout = ({ children }: { children: React.ReactNode | any }) => {
    useBackendAuth();
    
    const router = useRouter();
    const isPlugin = router.pathname.includes('plugin');

    const tonAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        tonConnectUI.connectionRestored.then(() => {
            setIsMounted(true);
        });
    }, [tonConnectUI])

    if (!isMounted) {
        return null;
    }

    return (
      <Fragment>
            {!isPlugin ? (
                <main>
                    <Header walletAddress={tonAddress} />
                    <div className="container">
                        {children}
                    </div>
                    <Footer />
                </main>
            ) : (
                children
            )}
      </Fragment>
    )
}