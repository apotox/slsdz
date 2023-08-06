import Joi from "joi";

interface Config {
    STAGE_NAME: string;
}

const schema = Joi.object<Config>({
    STAGE_NAME: Joi.string().required(),
});

let _config: Config = null;

export function getConfig(): Config {
    if (!_config) {
        _config = {
            STAGE_NAME: process.env.STAGE_NAME,
        };

        Joi.assert(_config, schema);
    }

    return _config;
}
