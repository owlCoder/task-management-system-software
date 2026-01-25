// Framework
import { Request, Response, NextFunction } from "express";

// Domain
import { UserRole } from "../../Domain/enums/user/UserRole";
import { AuthTokenClaimsType } from "../../Domain/types/auth/AuthTokenClaims";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";

/**
 * Middleware to authorize users based on their roles.
 * This function checks if the user has one of the permitted roles to access the resource.
 * If the user is not authorized, it logs the attempted access and responds with a 403 (Forbidden) status.
 * If the user is authorized, it proceeds to the next middleware.
 * @param {...UserRole[]} permittedRoles - An array of roles that are permitted to access the resource.
 * @returns A middleware function that checks if the user's role is authorized. If authorized, it calls next(). Otherwise, it responds with a 403 status and an error message.
 */
export const authorize = (...permittedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AuthTokenClaimsType;

    const normalize = (v: unknown) =>
      String(v ?? "")
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, "_");

    const rawRole = (user as any)?.role;
    const rawPermitted = permittedRoles;

    const strictAllowed = !!user && rawPermitted.includes(rawRole as any);

    const userNorm = normalize(rawRole);
    const permittedNorm = rawPermitted.map((r) => normalize(r));
    const normAllowed = !!user && permittedNorm.includes(userNorm);

    console.log("=== AUTH DEBUG ===");
    console.log("FILE:", __filename);
    console.log("URL:", req.method, req.originalUrl);
    console.log("raw role:", rawRole);
    console.log("raw permitted:", rawPermitted);
    console.log("strictAllowed:", strictAllowed);
    console.log("userNorm:", userNorm);
    console.log("permittedNorm:", permittedNorm);
    console.log("normAllowed:", normAllowed);
    console.log("==================");

    // koristi normAllowed (ili strictAllowed) – bitno je da vidiš šta je true
    if (!normAllowed) {
      const message = "Access denied";
      res.status(403).json({ message });
      return;
    }

    next();
  };
};
