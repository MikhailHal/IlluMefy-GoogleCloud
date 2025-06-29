import {onRequest} from "firebase-functions/v2/https";
import app from "./app";

export const api = onRequest({
    region: "asia-northeast1",
}, app);

export default app;
