// Framework
import { Request, Response, NextFunction } from "express";

// Libraries
import jwt from "jsonwebtoken";

// Domain
import { AuthTokenClaimsType } from "../../Domain/types/auth/AuthTokenClaims";

// Utils
import { logger } from "../../Utils/Logger/Logger";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenClaimsType;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn({
        service: "Gateway",
        code: "AUTHENTICATION_ERR",
        method: req.method,
        url: req.url,
        ip: req.ip
    }, "Token is missing");

    res.status(401).json({ success: false, message: "Token is missing!" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? ""
    ) as AuthTokenClaimsType;

    req.user = decoded;

    next();
  } catch (err) {
    logger.warn({
        service: "Gateway",
        code: "AUTHENTICATION_ERR",
        method: req.method,
        url: req.url,
        ip: req.ip
    }, "Invalid token provided");

    res.status(401).json({ success: false, message: "Invalid token provided!" });
  }
};
