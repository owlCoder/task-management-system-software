import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../Domain/enums/UserRole";
import { AuthTokenClaimsType } from "../../Domain/types/AuthTokenClaims";

export const authorize = (...permittedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AuthTokenClaimsType;

    if (!user || !permittedRoles.includes(user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
