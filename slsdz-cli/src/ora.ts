import ora, { Options } from "ora";

export function print(options: Options) {
    return ora({
        ...options,
        stream: process.stdout,
    });
}
