import Joi from "joi";

interface Config {
    SIGNING_SECRET: string;
    STAGE_NAME: string;
}

const schema = Joi.object<Config>({
    SIGNING_SECRET: Joi.string().required(),
    STAGE_NAME: Joi.string().required(),
});

let _config: Config = null;

export function getConfig(): Config {
    if (!_config) {
        _config = {
            SIGNING_SECRET: process.env.SIGNING_SECRET,
            STAGE_NAME: process.env.STAGE_NAME,
        };

        Joi.assert(_config, schema);
    }

    return _config;
}
