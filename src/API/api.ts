import { getCookie } from "cookies-next";

export interface ApiConfig {
    baseURL: string;
    headers: {[key: string]: string};
}

class API {
    private keyName = 'my-dapp-auth-token';

    config = {
        baseURL: '',
        headers: {},
    }
    
    constructor(conf: ApiConfig) {
        const token = getCookie(this.keyName) as string;
        
        this.config = {
            baseURL: conf.baseURL,
            headers: token ? {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...conf.headers,
            } : {
                'Content-Type': 'application/json',
                ...conf.headers,
            }
        };
    }
}

export default API;