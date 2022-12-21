import jam from "./types";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

let client: SecretManagerServiceClient;
let secret: string | Uint8Array;

export interface SecretUtilOptions {
    keyFile?: string | undefined;
    projectId?: string | undefined;
}

export class SecretUtil {
    constructor(options?: jam.SecretUtilOptions) {
        client = new SecretManagerServiceClient(options);
    }

    async getSecretPayload(
        name: string,
        secretVersion?: string
    ): Promise<string | Uint8Array> {
        return new Promise(async (resolve, reject) => {
            try {
                const projectId = await client.getProjectId();
                const [version] = await client.accessSecretVersion({
                    name: `projects/${projectId}/secrets/${name}/versions/${
                        secretVersion ?? "latest"
                    }`,
                });
                const { payload } = version;
                if (!payload?.data) {
                    reject("Failed to fetch secret");
                    return;
                }
                const { data } = payload;
                secret = data;
                resolve(secret);
            } catch (err) {
                reject(err);
            }
        });
    }

    getSecretString(name: string, secretVersion?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = (
                    await this.getSecretPayload(name, secretVersion)
                ).toString();
                if (!data) {
                    return;
                }
                resolve(data);
            } catch (err) {
                reject(err);
            }
        });
    }
}
