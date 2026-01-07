// Framework
import { Request, Response, NextFunction } from "express";

// Libraries
import jwt from "jsonwebtoken";

// Domain
import { AuthTokenClaimsType } from "../../Domain/types/auth/AuthTokenClaims";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";

declare global {
  	namespace Express {
    	interface Request {
      		user?: AuthTokenClaimsType;
    	}
  	}
}

/**
 * Middleware to authenticate incoming requests based on JWT token.
 * Checks the Authorization header for a Bearer token, validates it, and attaches the decoded token claims to the req.user object.
 * If the token is missing or invalid, it logs the event and responds with a 401 (Unauthorized) status.
 * @param {Request} req - The request object. If the token is valid, it will have a user property set to the decoded token claims.
 * @param {Response} res - The response object. Responds with a 401 status and an error message if the token is invalid or missing.
 * @param {NextFunction} next - The next middleware function in the request-response cycle. Called if the token is valid and the user is authenticated.
 * @returns {void} - Authentication middleware either passes control to the next middleware (`next()`) if authentication is successful or sends a response with a 401 status if authentication fails.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  	const authHeader = req.headers.authorization;

  	if (!authHeader || !authHeader.startsWith("Bearer ")) {
    	const message = "Token is missing";

    	logger.warn({
			service: "Gateway",
			code: "AUTHENTICATION_ERR",
			method: req.method,
			url: req.url,
			ip: req.ip
    	}, message);

    	res.status(401).json({ message: message });
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
    	const message = "Invalid token provided";

    	logger.warn({
			service: "Gateway",
			code: "AUTHENTICATION_ERR",
			method: req.method,
			url: req.url,
			ip: req.ip
    	}, message);

    	res.status(401).json({ message: message });
  	}
};
