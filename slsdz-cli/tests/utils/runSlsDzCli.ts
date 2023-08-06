import { CLI_BIN_PATH } from "./constants";
import { runCommand, RunCommandOptions, RunCommandResult } from "./runCommand";

export const runSlsDzCli = async (
    argsString: string,
    options?: RunCommandOptions,
): Promise<RunCommandResult> => {
    return runSlsDzCliWithArray(
        argsString.split(" ").filter((v) => !!v),
        options,
    );
};

const runSlsDzCliWithArray = async (
    args: string[],
    options?: RunCommandOptions,
): Promise<RunCommandResult> => {
    return await runCommand(
        "ts-node",
        ["--transpile-only", CLI_BIN_PATH, ...args],
        options,
    );
};
