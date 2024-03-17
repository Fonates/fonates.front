import { Fragment, useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export const Layout = ({ children }: { children: React.ReactNode | any }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [tonConnectUI] = useTonConnectUI();

    const tonWalletAddr = tonConnectUI?.wallet?.account.address;

    console.log('tonWalletAddr', tonWalletAddr);

    useEffect(() => {
        tonConnectUI.connectionRestored.then((isConnected) => {
            console.log('isConnected', isConnected);
            setIsMounted(true);
        });
    }, [tonConnectUI])

    if (!isMounted) {
        return null;
    }

    return (
      <Fragment>
            <main>
                <Header walletAddress={tonWalletAddr} />
                <div className="container">
                    {children}
                </div>
                <Footer />
            </main>
      </Fragment>
    )
}