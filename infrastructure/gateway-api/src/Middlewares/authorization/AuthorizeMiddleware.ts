import { Request, Response, NextFunction } from "express";
import { UserDTO } from "../../Domain/DTOs/UserDTO";
import { UserRole } from "../../Domain/enums/UserRole";

export const authorize = (...permittedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as UserDTO;

    if (!user || !permittedRoles.includes(user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
