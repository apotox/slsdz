import CloudFormation from "aws-sdk/clients/cloudformation";

import { templateFnBody } from "./template";
import { DOMAIN_NAME } from "./consts";

let client = null;

export function getCfClient(): CloudFormation {
    if (!client) {
        client = new CloudFormation();
    }

    return client;
}

export async function deployNewFunction({
    functionId,
    fileName,
    lambdaFunctionName,
    additionalParameters,
}: {
    functionId: string;
    fileName: string;
    lambdaFunctionName: string;
    additionalParameters: {
        BASIC_ROLE_ARN: string;
        FUNCTIONS_BUCKET: string;
        APIGATEWAY_ID: string;
        STAGE_NAME: string;
        CERTIFICATE_ARN: string;
    };
}) {
    const stackName = `sls-stack-${functionId}-${Date.now()}`;
    const domainName = `${functionId}.${DOMAIN_NAME}`;
    const params: CloudFormation.CreateStackInput = {
        StackName: stackName,
        TemplateBody: templateFnBody,
        Parameters: [
            {
                ParameterKey: "functionName",
                ParameterValue: lambdaFunctionName,
            },
            {
                ParameterKey: "basicRoleArn",
                ParameterValue: additionalParameters.BASIC_ROLE_ARN,
            },
            {
                ParameterKey: "functionsBucket",
                ParameterValue: additionalParameters.FUNCTIONS_BUCKET,
            },
            {
                ParameterKey: "fileName",
                ParameterValue: fileName,
            },
            {
                ParameterKey: "apigatewayId",
                ParameterValue: additionalParameters.APIGATEWAY_ID,
            },
            {
                ParameterKey: "apigatewayStage",
                ParameterValue: additionalParameters.STAGE_NAME,
            },
            {
                ParameterKey: "certificateArn",
                ParameterValue: additionalParameters.CERTIFICATE_ARN,
            },
            {
                ParameterKey: "domainName",
                ParameterValue: domainName,
            },
        ],
        Capabilities: ["CAPABILITY_IAM"],
    };

    return getCfClient().createStack(params).promise();
}
