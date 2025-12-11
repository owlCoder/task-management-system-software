import { IAliveService } from "../Domain/services/IAliveService";


export class AliveService implements IAliveService {
    async Alive(): Promise<boolean> {
        try {
            const publicKey = process.env.MAILJET_API_KEY;
            const privateKey = process.env.MAILJET_API_SECRET;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);

            if (!publicKey || !privateKey) {
                throw new Error("Mailjet API keys not found in .env!");
            }

            const auth = Buffer.from(`${publicKey}:${privateKey}`).toString("base64");

            const response = await fetch("https://api.mailjet.com/v3/REST/user", {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${auth}`,
                    "Content-Type": "application/json"
                },
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) return false;
            return true;

        } catch (error) {
            if (error.name === "AbortError") {
                console.error("Mailjet ping timeout (4s).");
            } else {
                console.error("Mailjet ping error:", error);
            }
            return false;
        }
    }
}