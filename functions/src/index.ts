import {onRequest} from "firebase-functions/v2/https";

export const health = onRequest((_, response) => {
    response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
