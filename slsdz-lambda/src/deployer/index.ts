import { Context, S3Event } from "aws-lambda";
import { isFunctionExists, getLambda } from "../common/lambda";
import { buildFunctionArn, buildFunctionName } from "../common/helpers";
import { getConfig } from "./config";
import { deployNewFunction } from "../common/cloud-formation";

const config = getConfig();

export const handler = async function (event: S3Event, context: Context) {
    const records = event.Records?.filter(
        (r) =>
            r.eventName === "ObjectCreated:Put" &&
            r.s3.object.key.endsWith(".zip"),
    );

    if (!records?.length) {
        return false;
    }

    for (const record of records) {
        const fileName = record.s3.object.key;

        const functionId = fileName.split(".")[0];

        try {
            const functionArn = buildFunctionArn(context, functionId);
            const exists = await isFunctionExists(functionArn);

            if (!exists) {
                await deployNewFunction({
                    fileName,
                    functionId,
                    lambdaFunctionName: buildFunctionName(functionId),
                    additionalParameters: config,
                });
            } else {
                await getLambda()
                    .updateFunctionCode({
                        FunctionName: functionArn,
                        S3Bucket: config.FUNCTIONS_BUCKET,
                        S3Key: fileName,
                    })
                    .promise();
            }
        } catch (err) {
            console.log(err);
            console.error("deploy function failed", functionId);
            //skip
        }
    }

    return true;
};
