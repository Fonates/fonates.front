import { Fragment, useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useBackendAuth } from "@/hooks/useBackendAuth";

export const Layout = ({ children }: { children: React.ReactNode | any }) => {
    useBackendAuth();
    
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
            <main>
                <Header walletAddress={tonAddress} />
                <div className="container">
                    {children}
                </div>
                <Footer />
            </main>
      </Fragment>
    )
}