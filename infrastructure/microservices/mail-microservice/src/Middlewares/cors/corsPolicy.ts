import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',').map(origin => origin.trim()) ?? [""],
    methods: process.env.CORS_METHODS?.split(',').map(method => method.trim()) ?? ['POST','GET'],
    optionsSuccessStatus: 200
}

export const corsPolicy = cors(corsOptions);