import Joi from "joi";

interface Config {
    FUNCTIONS_BUCKET: string;
    BASIC_ROLE_ARN: string;
    STAGE_NAME: string;
    APIGATEWAY_ID: string;
    CERTIFICATE_ARN: string;
}

const schema = Joi.object<Config>({
    FUNCTIONS_BUCKET: Joi.string().required(),
    BASIC_ROLE_ARN: Joi.string().required(),
    STAGE_NAME: Joi.string().required(),
    APIGATEWAY_ID: Joi.string().required(),
    CERTIFICATE_ARN: Joi.string().required(),
});

let _config: Config = null;

export function getConfig(): Config {
    if (!_config) {
        _config = {
            BASIC_ROLE_ARN: process.env.BASIC_ROLE_ARN,
            FUNCTIONS_BUCKET: process.env.FUNCTIONS_BUCKET,
            STAGE_NAME: process.env.STAGE_NAME,
            APIGATEWAY_ID: process.env.APIGATEWAY_ID,
            CERTIFICATE_ARN: process.env.CERTIFICATE_ARN,
        };

        Joi.assert(_config, schema);
    }

    return _config;
}
