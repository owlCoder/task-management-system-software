import { ROUTES } from "../Domain/constants/routes";
import { EnvMicroservice } from "../Domain/types/EnvMicroservice";


export function loadMicroservices(): EnvMicroservice[] {
    return Object.entries(ROUTES)
        .filter(([key, value]) => key.endsWith("_API") && typeof value === "string")
        .map(([key, value]) => ({
            name: key.replace("_API", ""),
            url: value
        }));
}