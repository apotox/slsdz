import axios, { AxiosInstance } from "axios";
import { SLSDZ_API_BASE_URL } from "./consts";

interface Config {
    id: string;
    secret: string;
}

export class Slsdz {
    static client: AxiosInstance = axios.create({
        baseURL: SLSDZ_API_BASE_URL,
    });

    constructor(private config: Config) {}

    static async initNewFunction() {
        const resp = await Slsdz.client.get("/signed");

        const { id, secret } = resp.data;

        return {
            id,
            secret,
        };
    }

    async uploadFunctionCode(zipBuffer: Buffer) {
        const { id, secret } = this.config;
        const respPreSigned = await Slsdz.client.get(
            `/signed?id=${id}&secret=${encodeURIComponent(secret)}`,
        );
        const uploadUrl = respPreSigned.data.url;
        const options = {
            method: "put",
            url: uploadUrl,
            headers: {
                "Content-Type": "application/zip",
                "x-amz-acl": "private",
            },
            data: zipBuffer,
        };

        const respUpload = await Slsdz.client(options);

        return respUpload.status;
    }

    async readLogs() {
        const { id, secret } = this.config;
        const resp = await Slsdz.client.get(
            `/logs?id=${id}&secret=${encodeURIComponent(secret)}`,
        );

        if (resp?.status === 200) {
            return resp.data;
        }

        return [];
    }
}
