import LazyBackgroundImage from "@/components/LazyBackgroundImage";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Layout } from "@/components/Layout";
import { BackendTokenProvider } from "@/contexts/backendTokenContext";

const MANIFEST_URL = 'https://fonates.com/tonconnect/tonconnect-manifest.json';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <BackendTokenProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BackendTokenProvider>
    </TonConnectUIProvider>
  );
}
