import axios from "axios";
import { IHealth_Service } from "../Domain/Services/IHealth_Service";

const MICROSERVICES: string[] = [];

export class Health_Service implements IHealth_Service {
    private intervalId?: NodeJS.Timeout;

    async start(): Promise<void> {
        this.intervalId = setInterval(async () => {
            for (const url of MICROSERVICES) {
                try {
                    const response = await axios.get(url);
                    console.log(
                        `\x1b[36m[PingService]\x1b[0m ${url} is up. Status: ${response.status}`
                    );
                } catch (err: any) {
                    console.error(
                        `\x1b[31m[PingService]\x1b[0m ${url} is down!`,
                        err.message
                    );
                }
            }
        }, 15 * 1000);
    }

    async stop() {
        if (this.intervalId) clearInterval(this.intervalId);
    }
}

