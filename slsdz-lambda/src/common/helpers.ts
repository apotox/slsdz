import { Context } from "aws-lambda";
import crypto from "crypto";
export function getAccountIdAndRegion(context: Context) {
    return context.invokedFunctionArn?.split(":function:")[0];
}

export function buildFunctionName(id: string) {
    return `slsdz-${process.env.STAGE_NAME}-user-${id}`;
}

export function buildFunctionArn(context: Context, functionId: string) {
    return `${getAccountIdAndRegion(context)}:function:${buildFunctionName(
        functionId,
    )}`;
}

export const generateRandomString = (bytes = 5) => {
    return crypto.randomBytes(bytes).toString("hex");
};
