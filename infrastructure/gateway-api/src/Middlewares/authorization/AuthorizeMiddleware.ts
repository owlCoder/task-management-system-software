// Framework
import { Request, Response, NextFunction } from "express";

// Domain
import { UserRole } from "../../Domain/enums/user/UserRole";
import { AuthTokenClaimsType } from "../../Domain/types/auth/AuthTokenClaims";

// Constants
import { SERVICES } from "../../Constants/services/Services";
import { ERROR_CODE } from "../../Constants/error/ErrorCodes";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";
import { getSIEMService } from "../../Infrastructure/siem/service/SIEMServiceInstance";
import { generateEvent } from "../../Infrastructure/siem/utils/events/GenerateEvent";

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

    	if (!user || !permittedRoles.includes(user.role)) {
			const message = "Unauthorized - access denied";

			logger.warn({
				service: SERVICES.SELF,
				code: ERROR_CODE.AUTHORIZATION,
				method: req.method,
				url: req.url,
				ip: req.ip
			}, message);

			getSIEMService().sendEvent(
				generateEvent(SERVICES.SELF, req, 403, message, ERROR_CODE.AUTHORIZATION)
			);

			res.status(403).json({ message: message });
			return;
    	}

    	next();
  	};
}