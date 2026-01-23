import { ROUTES } from "../Domain/constants/routes";
import { EnvMicroservice } from "../Domain/types/EnvMicroservice";

export function loadMicroservices(): EnvMicroservice[] {
  return Object.keys(ROUTES)
    .filter((key) => key.endsWith("_API"))
    .map((key) => {
      const baseUrl = process.env[key];
      const path = ROUTES[key as keyof typeof ROUTES];

      if (!baseUrl) {
        throw new Error(`[HealthService] Missing base URL for ${key} in .env`);
      }
      const normalizedBase = baseUrl.replace(/\/$/, "");
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;

      return {
        name: key.replace("_API", ""),
        url: `${normalizedBase}${normalizedPath}`,
      };
    });
}