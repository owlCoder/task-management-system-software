import { EnvMicroservice } from "../Domain/types/EnvMicroservice";


export function loadMicroservicesFromEnv(): EnvMicroservice[] {
    return Object.entries(process.env)
        .filter(([key, value]) => key.endsWith("_API") && value)
        .map(([key, value]) => ({
            name: key.replace("_API", ""),
            url: value as string
        }));
}