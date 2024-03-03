'use client';
import { Fragment, useEffect, useState } from "react"

export const Layout = ({ children }: { children: React.ReactNode }) => {
      const [isMounted, setIsMounted] = useState(false);

      useEffect(() => {
        setIsMounted(typeof window !== "undefined");
      }, []);
    
      if (!isMounted) return null;
      
      return (
            <Fragment>
                  {children}
            </Fragment>
      )
}