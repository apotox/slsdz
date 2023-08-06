import { APIGatewayEvent } from "aws-lambda";
import { getSignedUrl } from "../common/s3";
import { generateSignature, verifySignature } from "../common/crypt";
import { getConfig } from "./config";

const { SIGNING_SECRET, FUNCTIONS_BUCKET } = getConfig();

export const handler = async function (event: APIGatewayEvent) {
    if (
        event.queryStringParameters?.id &&
        event.queryStringParameters?.secret
    ) {
        const { id, secret } = event.queryStringParameters;
        const verified = verifySignature(secret, id, SIGNING_SECRET);

        if (!verified) {
            return {
                statusCode: 401,
            };
        }

        const { url } = await getSignedUrl({
            _id: id,
            bucket: FUNCTIONS_BUCKET,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                url,
                id,
                secret,
            }),
        };
    }

    const { url, id } = await getSignedUrl({
        bucket: FUNCTIONS_BUCKET,
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            url,
            id,
            secret: generateSignature(id, SIGNING_SECRET),
        }),
    };
};
