import { createHmac } from "crypto";

export function verifySignature(
    signature: string,
    message: string,
    key: string,
) {
    const hmac = createHmac("sha256", key);
    hmac.update(message);
    const calculatedSignature = hmac.digest("base64");

    return signature === calculatedSignature;
}

export function generateSignature(message: string, key: string) {
    const hmac = createHmac("sha256", key);
    hmac.update(message);
    const calculatedSignature = hmac.digest("base64");

    return calculatedSignature;
}
