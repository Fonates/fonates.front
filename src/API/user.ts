import axios from "axios";
import API from "./api";

export interface IUser {
    address: string;
    username: string;
    avatarUrl: string;
    status?: string;
}

export default class ApiUser extends API {
    private prefix = 'users/';

    public async Create(link: IUser) {
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