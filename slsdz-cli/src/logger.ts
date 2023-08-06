import chalk from "chalk";

export class Logger {
    #level: number;
    constructor(level: number) {
        this.#level = level;
    }

    aDate() {
        return new Date().toLocaleString();
    }

    ERROR(tag: string, value: unknown) {
        if (this.#level >= 0) {
            console.error(chalk.red(`${this.aDate()} - ${tag}: `, value, "\n"));
        }
    }

    INFO(tag: string, value: unknown) {
        if (this.#level >= 1) {
            console.log(chalk.blue(`${this.aDate()} - ${tag}: `, value, "\n"));
        }
    }

    WARN(tag: string, value: unknown) {
        if (this.#level >= 2) {
            console.warn(
                chalk.yellow(`${this.aDate()} - ${tag}: `, value, "\n"),
            );
        }
    }

    TRACE(tag: string, value: unknown) {
        if (this.#level >= 1) {
            console.log(chalk.green(tag, value, "\n"));
        }
    }
}
