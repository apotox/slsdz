import { createCNameRecord } from "../common/cf";
import { getConfig } from "./config";

const {
    API_GATEWAY_DOMAIN,
    CLOUDFLARE_API_KEY,
    CLOUDFLARE_EMAIL,
    CLOUDFLARE_ZONE_ID,
} = getConfig();

export const handler = async function (event: any) {
    const stackId = event.resources[0]?.split("/")[1];
    if (!stackId) {
        return;
    }

    const functionId = stackId.split("-")[2];

    await createCNameRecord({
        FUNCTION_ID: functionId,
        API_GATEWAY_DOMAIN,
        CLOUDFLARE_API_KEY,
        CLOUDFLARE_EMAIL,
        CLOUDFLARE_ZONE_ID,
    });

    return;
};
