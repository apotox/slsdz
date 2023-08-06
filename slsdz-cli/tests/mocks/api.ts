import express from "express";

const app = express();

app.get("/signed", (req, res) => {
    if (req.query.id && req.query.secret) {
        return res.send({
            id: "function-id",
            secret: "secret",
            url: `${process.env.SLSDZ_API_BASE_URL}upload`,
        });
    }

    return res.send({
        id: "function-id",
        secret: "secret",
    });
});

app.put("/upload", (req, res) => {
    return res.send("Received a put HTTP method");
});

app.get("/logs", (req, res) => {
    const mockLogs = [
        {
            ts: Date.now(),
            log: "test message log 1",
        },
        {
            ts: Date.now(),
            log: "test message log 2",
        },
    ];

    return res.send(mockLogs);
});

export { app };
