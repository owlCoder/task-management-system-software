// Framework (middleware)
import cors, { CorsOptions } from "cors";

// CORS Configuration
const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) ?? [""],
    methods: process.env.CORS_METHODS?.split(',').map(method => method.trim()) ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200
}

export const corsPolicy = cors(corsOptions);