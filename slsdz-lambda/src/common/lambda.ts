import Lambda from "aws-sdk/clients/lambda";

let _lambda = null;

export function getLambda(): Lambda {
    if (!_lambda) {
        _lambda = new Lambda();
    }

    return _lambda;
}

export async function isFunctionExists(functionName: string) {
    try {
        const params = {
            FunctionName: functionName,
        };
        await getLambda().getFunction(params).promise();

        return true;
    } catch (error) {
        if (error.code === "ResourceNotFoundException") {
            return false;
        }

        throw error;
    }
}
