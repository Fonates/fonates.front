import axios from "axios";
import API from "./api";

export interface IDonate {
    id: number;
    hash: string;
    amount: number;
    username: string;
    comment: string;
    status?: string;
    linkId: number;
}

export default class ApiDonates extends API {
    private prefix = 'donates/';

    public async Create(donate: IDonate) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}create`;
            const { data } = await axios.get(endpoint, {
                headers: this.config.headers,
                data: donate,
            });

            if (!data) {
                throw new Error('[ERROR]: Create donate');
            }
    
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async SSEStreaming(slug: string, callback: (data: MessageEvent<any>) => void) {
        try {
            const url = `${this.config.baseURL}${this.prefix}${slug}/stream`;
            const eventSourse = new EventSource(url);

            eventSourse.onmessage = (event) => {
                callback(event);
            };

            eventSourse.onerror = (event) => {
                console.error(event);
            };

            return eventSourse;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}