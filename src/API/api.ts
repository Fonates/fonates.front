export interface ApiConfig {
    baseURL: string;
    headers: {[key: string]: string};
}

class API {
    config = {
        baseURL: '',
        headers: {},
    }
    
    constructor(conf: ApiConfig) {
        this.config = {
            baseURL: conf.baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...conf.headers,
            },
        };
    }
}

export default API;