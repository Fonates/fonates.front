import type { AppProps } from "next/app";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Layout } from "@/components/Layout";
import { BackendTokenProvider } from "@/contexts/backendTokenContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "@/styles/globals.css";

const MANIFEST_URL = 'https://fonates.com/tonconnect/tonconnect-manifest.json';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPlugin = router.pathname.includes('plugin');
  
  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (isPlugin) html.style.background = 'transparent';
  }, [router]);

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
