import fs from "fs";
import { SLSDZ_CONFIG_FILENAME, SLSDZ_DOMAIN_NAME } from "./consts";
import { Logger } from "./logger";
import yargs from "yargs";
import { Slsdz } from "./slsdz";
import { AxiosError } from "axios";
import { print } from "./ora";
import { join, normalize } from "path";

const cliBuilder = yargs(process.argv.slice(2));

const { argv } = cliBuilder
    .option("id", {
        demandOption: true,
        default: process.env.SFUNCTION_ID || null,
        describe: "function id",
        type: "string",
    })
    .option("secret", {
        demandOption: true,
        describe: "function secret",
        default: process.env.SFUNCTION_SECRET || null,
        type: "string",
    })
    .option("init", {
        demandOption: true,
        default: false,
        describe: "init new function (id and secret)",
        type: "boolean",
    })
    .option("zip", {
        alias: "f",
        demandOption: false,
        describe: "upload a function package (.zip)",
        type: "string",
    })
    .option("v", {
        alias: "verbose",
        demandOption: false,
        describe: "verbose level 0,1,2",
        default: 1,
        type: "number",
    })
    .option("log", {
        demandOption: false,
        describe: "function log",
        type: "boolean",
        default: false,
    })
    .option("about", {
        demandOption: false,
        describe: "about",
        type: "boolean",
        default: false,
    });

const flags = argv as Awaited<typeof argv>;
const logger = new Logger(flags.v);

async function cli() {
    if (flags.about) {
        logger.INFO("", "\n Created by Safi <safidev@proton.me>\n");

        return;
    }

    const { id, secret, init, zip, log } = flags;

    let config = {
        id,
        secret,
        init,
    };

    if (config.init) {
        const spinner = print({
            text: "initializing new slsdz function...",
        }).start();

        const credentials = await Slsdz.initNewFunction();
        fs.writeFileSync(SLSDZ_CONFIG_FILENAME, JSON.stringify(credentials));
        spinner.stop().succeed();

        return;
    }

    if (config.id == null || config.secret == null) {
        const cfg = loadConfig();
        if (!cfg) {
            logger.ERROR(
                "NO_CONFIG",
                "please use --init to initialize new function",
            );

            return;
        }

        config = {
            ...config,
            ...cfg,
        };
    }

    logger.INFO(
        "API_URL",
        `your function URL 🚀 https://${config.id}.${SLSDZ_DOMAIN_NAME}`,
    );

    const sls = new Slsdz(config);

    if (log) {
        const logs = await sls.readLogs();
        logs.forEach((e) => {
            logger.TRACE(new Date(e.ts).toISOString(), e.log);
        });

        return;
    }

    if (zip) {
        if (!zip.endsWith(".zip")) {
            throw new Error("selected file should be a .zip package");
        }

        const zipPath = normalize(join(process.cwd(), zip));
        const spinner = print({
            text: "☁️  uploading [" + zipPath + "]\n",
        }).start();

        if (!fs.existsSync(zipPath)) {
            spinner.stop().fail("no file! " + zipPath);

            return;
        }

        const stats = fs.statSync(zipPath);
        spinner.info(`📦 file size: ${stats.size} bytes`);
        const zipBuffer = fs.readFileSync(zipPath);
        const status = await sls.uploadFunctionCode(zipBuffer);
        logger.INFO("UPLOAD_STATUS", status);
        spinner.stop().succeed();
    }
}

function loadConfig() {
    if (!fs.existsSync(SLSDZ_CONFIG_FILENAME)) return null;

    return {
        ...JSON.parse(String(fs.readFileSync(SLSDZ_CONFIG_FILENAME))),
    };
}

// start cli
cli().catch((err) => {
    if (err instanceof AxiosError) {
        console.log(err.response.data);
    }

    logger.ERROR("unknown error", err);
});
