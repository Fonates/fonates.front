import type { Metadata } from "next";
import { Noto_Sans_Display } from "next/font/google";
import { Header } from "src/components/Header/Header";
import { Footer } from "src/components/Footer/Footer";
import "./globals.css";
import { useEffect, useState } from "react";
import { Layout } from "src/components/Layout";
import LazyBackgroundImage from "src/components/LazyBackgroundImage";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>
          <LazyBackgroundImage img={'/radials.svg'} style={{
            width: "100%",  
            minHeight: '100vh',
            backgroundPosition: 'center',
            backgroundPositionY: '-224px',
            // backgroundSize: 'cover',
          }}>
            <main>
              <Header />
              <div className="container">
                {children}
              </div>
              <Footer />
            </main>
          </LazyBackgroundImage>
        </Layout>
      </body>
    </html>
  );
}
