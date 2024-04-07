import axios from "axios";
import API from "./api";
import { Account, TonProofItemReplySuccess } from "@tonconnect/ui-react";

// interface IUser {
//     address: string;
//     username: string;
//     avatarUrl: string;
//     status?: string;
// }

export default class ApiTonAuth extends API {
    private prefix = 'tonproof/';

    public async GeneratePayload() {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}generatePayload`;
            const { data } = await axios.post(endpoint, {}, {
                headers: this.config.headers,
            });
    
            if (!data?.payload) {
                throw new Error('[ERROR]: GenerateLink');
            }

            return data?.payload;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    public async CheckProof(proof: any, account: Account) {
        try {
            const endpoint = `${this.config.baseURL}${this.prefix}checkProof`;
            const { data } = await axios.post(endpoint, {
                address: account.address,
                network: account.chain,
                proof,
            }, {
                headers: this.config.headers,
            });
    
            if (!data?.token) {
                throw new Error('[ERROR]: GenerateLink');
            }

            return data?.token;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}