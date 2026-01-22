import dotenv from "dotenv";
dotenv.config();

import appPromise from "./app";

const port = process.env.PORT;

(async () => {
    const app = await appPromise;

    app.listen(port, () => {
        console.log(
            `\x1b[32m[TCPListen@2.1]\x1b[0m localhost:${port}`
        );
    });
})();
