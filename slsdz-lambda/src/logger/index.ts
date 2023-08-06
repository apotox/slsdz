import { APIGatewayEvent } from "aws-lambda";
import { verifySignature } from "../common/crypt";
import { buildFunctionName } from "../common/helpers";
import { getCwClient } from "../common/cw";
import { getConfig } from "./config";

const { SIGNING_SECRET } = getConfig();

export const handler = async function (event: APIGatewayEvent) {
    if (
        !event.queryStringParameters?.id ||
        !event.queryStringParameters?.secret
    ) {
        return {
            statusCode: 401,
        };
    }

    const { id, secret } = event.queryStringParameters;

    const verified = verifySignature(secret, id, SIGNING_SECRET);

    if (!verified) {
        return {
            statusCode: 401,
        };
    }

    const logGroupName = `/aws/lambda/${buildFunctionName(id)}`;

    const result = await getCwClient()
        .describeLogStreams({
            logGroupName,
            orderBy: "LastEventTime",
            descending: true,
            limit: 1,
        })
        .promise();

    const logStreamNames = result?.logStreams.map(
        (logStream) => logStream.logStreamName,
    );

    if (!logStreamNames?.length) {
        return {
            statusCode: 200,
            body: "no logs!",
        };
    }

    const logStreamName = logStreamNames[0];

    const params = {
        logGroupName,
        logStreamName,
        startFromHead: true,
        limit: 10,
    };

    const { events } = await getCwClient().getLogEvents(params).promise();

    const lastMessages = events
        ?.filter(
            (e) =>
                !e?.message.includes("REPORT RequestId") &&
                !e?.message.includes("INIT_START"),
        )
        ?.map((e) => ({
            ts: e.timestamp,
            log: e.message,
        }));

    return {
        statusCode: 200,
        body: JSON.stringify(lastMessages || []),
    };
};
