import { createContext, useState } from "react";

interface BackendTokenContextType {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const BackendTokenContext = createContext({
    token: null,
    setToken: () => {},
} as BackendTokenContextType);

export const BackendTokenProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    return (
        <BackendTokenContext.Provider value={{token, setToken}}>
            {children}
        </BackendTokenContext.Provider>
    );
};
