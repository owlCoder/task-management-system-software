import { Request, Response, NextFunction } from "express";

 // 404 not found handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
};

 // global error handler
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(" Error:", err.message);
  console.error(" Stack:", err.stack);

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
};