import Joi from "joi";

interface Config {
    API_GATEWAY_DOMAIN: string;
    CLOUDFLARE_API_KEY: string;
    CLOUDFLARE_EMAIL: string;
    CLOUDFLARE_ZONE_ID: string;
    STAGE_NAME: string;
}

const schema = Joi.object<Config, true>({
    API_GATEWAY_DOMAIN: Joi.string().required(),
    CLOUDFLARE_API_KEY: Joi.string().required(),
    CLOUDFLARE_EMAIL: Joi.string().required(),
    CLOUDFLARE_ZONE_ID: Joi.string().required(),
    STAGE_NAME: Joi.string().required(),
});

let _config: Config = null;

export function getConfig(): Config {
    if (!_config) {
        _config = {
            API_GATEWAY_DOMAIN: process.env.API_GATEWAY_DOMAIN,
            CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
            CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL,
            STAGE_NAME: process.env.STAGE_NAME,
            CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
        };

        Joi.assert(_config, schema);
    }

    return _config;
}
