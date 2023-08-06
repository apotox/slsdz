import Joi from "joi";

interface Config {
    SIGNING_SECRET: string;
    FUNCTIONS_BUCKET: string;
}

const schema = Joi.object<Config, true>({
    SIGNING_SECRET: Joi.string().required(),
    FUNCTIONS_BUCKET: Joi.string().required(),
});

let _config: Config = null;

export function getConfig(): Config {
    if (!_config) {
        _config = {
            SIGNING_SECRET: process.env.SIGNING_SECRET,
            FUNCTIONS_BUCKET: process.env.FUNCTIONS_BUCKET,
        };

        Joi.assert(_config, schema);
    }

    return _config;
}
