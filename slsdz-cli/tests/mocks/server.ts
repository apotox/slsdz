import { Server } from "http";
import { app } from "./api";

export function startServer(port: string): Promise<Server> {
    return new Promise((r) => {
        const server = app.listen(port, () => {
            console.log(`API Mock server listening on port ${port}!`);

            r(server);
        });
    });
}
