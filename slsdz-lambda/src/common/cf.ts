import axios from "axios";

export async function createCNameRecord({
    FUNCTION_ID,
    API_GATEWAY_DOMAIN,
    CLOUDFLARE_API_KEY,
    CLOUDFLARE_EMAIL,
    CLOUDFLARE_ZONE_ID,
}) {
    // Set the request headers
    const headers = {
        "Content-Type": "application/json",
        "X-Auth-Email": CLOUDFLARE_EMAIL,
        "X-Auth-Key": CLOUDFLARE_API_KEY,
    };

    // Set the Cloudflare ZONE ID key
    const endpointUrl = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`;

    const data = {
        type: "CNAME",
        name: FUNCTION_ID,
        content: API_GATEWAY_DOMAIN,
        proxied: true,
    };

    await axios.post(endpointUrl, data, { headers });
}
