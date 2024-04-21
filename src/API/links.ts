import axios from "axios";
import API from "./api";
import { IUser } from "./user";

export interface ILink {
    key?: string;
    name: string;
    status?: string;
    User?: IUser;
}

export default class ApiLinks extends API {
    private prefix = 'links/';

    public async GetLinkBySlug(slug: string) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}${slug}`;
            const { data } = await axios.get(endpoint, {
                headers: this.config.headers,
            });

            if (!data) {
                throw new Error('[ERROR]: GetLinkBySlug');
            }
    
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async GetKeyActivation(slug: string) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}${slug}/key`;
            const { data } = await axios.get(endpoint, {
                headers: this.config.headers,
            });

            if (!data) {
                throw new Error('[ERROR]: GetKeyActivation');
            }
    
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async GenerateLink(link: ILink) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}create`;
            const { data } = await axios.post(endpoint, {
                ...link,
            }, {
                headers: this.config.headers,
            });
    
            if (!data) {
                throw new Error('[ERROR]: GenerateLink');
            }

            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async ActivateLink(slug: string, key: string) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}${slug}/activate`;
            const { data } = await axios.patch(endpoint, {}, {
                headers: {
                    ...this.config.headers,
                    'X-Link-Activation-Key': key,
                }
            });

            if (!data) {
                throw new Error('[ERROR]: ActivateLink');
            }
    
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async GetLinkStatus(slug: string) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}${slug}/status`;
            const { data } = await axios.get(endpoint, {
                headers: this.config.headers,
            });

            if (!data) {
                throw new Error('[ERROR]: GetLinkStatus');
            }
    
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}