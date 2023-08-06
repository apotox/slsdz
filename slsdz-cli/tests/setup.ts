import { startServer } from "./mocks/server";

const mockdServerPort = "5001";
process.env.SLSDZ_API_BASE_URL = `http://127.0.0.1:${mockdServerPort}/`;

export default async function () {
    const mockedServer = await startServer(mockdServerPort);

    return () => {
        mockedServer.close();
    };
}
