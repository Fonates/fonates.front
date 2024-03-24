import axios from "axios";
import API from "./api";

interface ILink {
    address: string;
    username: string;
    link: string;
    status?: string;
}

export default class ApiLinks extends API {
    private prefix = 'links/';

    public async GetLinkByAddress(address: string) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}${address}`;
            const { data } = await axios.get(endpoint, {
                headers: this.config.headers,
            });

            if (!data) {
                throw new Error('[ERROR]: GetLinkByAddress');
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
}