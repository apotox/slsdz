import { APIGatewayEvent, Context } from "aws-lambda";
import { buildFunctionArn } from "../common/helpers";
import { getLambda } from "../common/lambda";
import Lambda from "aws-sdk/clients/lambda";
import { SUBDOMAIN_REGEX } from "../common/consts";

export const handler = async function (
    event: APIGatewayEvent,
    context: Context,
) {
    context.callbackWaitsForEmptyEventLoop = false;

    if (!event.requestContext.domainName?.match(SUBDOMAIN_REGEX)) {
        return {
            statusCode: 400,
            body: JSON.stringify("domain name not allowed!"),
        };
    }

    const functionId = event.requestContext.domainPrefix;
    const functionArn = buildFunctionArn(context, functionId);

    const params: Lambda.InvocationRequest = {
        FunctionName: functionArn,
        Payload: JSON.stringify({
            body: event.body,
            headers: event.headers,
            method: event.httpMethod,
            params: event.pathParameters,
            query: event.queryStringParameters,
        }),
        InvocationType: "RequestResponse",
        LogType: "Tail",
    };

    try {
        const result = await getLambda().invoke(params).promise();

        return JSON.parse(String(result.Payload));
    } catch (err) {
        console.error("invoke function error", functionArn, err);

        return {
            statusCode: 400,
            body: "application failed",
        };
    }
};
