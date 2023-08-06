import { beforeAll } from "vitest";
//init env
process.env.FUNCTIONS_BUCKET = "test";
process.env.BASIC_ROLE_ARN = "test";
process.env.STAGE_NAME = "test";
process.env.APIGATEWAY_ID = "test";
process.env.CERTIFICATE_ARN = "test";
process.env.CLOUDFLARE_API_KEY = "test";
process.env.CLOUDFLARE_EMAIL = "test";
process.env.CLOUDFLARE_ZONE_ID = "test-zone-id";
process.env.SIGNING_SECRET = "secret";
process.env.API_GATEWAY_DOMAIN = "example.execute-api.de";

beforeAll(async () => {
    //skip
});
