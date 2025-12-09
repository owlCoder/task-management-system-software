import { Request, Response, NextFunction } from "express";

 // request logger middleware
 // ispisuje sve HTTP zahteve (samo u development modu)
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === "development") {
    console.log(`📨 ${req.method} ${req.path}`);
  }
  next();
};