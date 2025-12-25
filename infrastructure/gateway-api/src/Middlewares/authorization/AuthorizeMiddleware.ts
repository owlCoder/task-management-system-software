// Framework
import { Request, Response, NextFunction } from "express";

// Domain
import { UserRole } from "../../Domain/enums/user/UserRole";
import { AuthTokenClaimsType } from "../../Domain/types/auth/AuthTokenClaims";

// Utils
import { logger } from "../../Utils/Logger/Logger";

export const authorize = (...permittedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AuthTokenClaimsType;

    if (!user || !permittedRoles.includes(user.role)) {
      logger.warn({
          service: "Gateway",
          code: "AUTHORIZATION_ERR",
          method: req.method,
          url: req.url,
          ip: req.ip
      }, "Access denied");

      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
