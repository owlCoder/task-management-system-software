// Framework (middleware)
import cors, { CorsOptions } from "cors";

/**
 * CORS Configuration for the Gateway API.
 * Sets up allowed origins and HTTP methods for cross-origin requests.
 * - `origin`: List of allowed origins for cross-origin requests, set through `CORS_ORIGIN` environment variable. Defaults to an empty string.
 * - `methods`: List of allowed HTTP methods for cross-origin requests, set through `CORS_METHODS` environment variable. Defaults to ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].
 * - `optionsSuccessStatus`: HTTP status code to send for successful OPTIONS requests. Defaults to 200.
 */
const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) ?? [""],
    methods: process.env.CORS_METHODS?.split(',').map(method => method.trim()) ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200
}

export const corsPolicy = cors(corsOptions);