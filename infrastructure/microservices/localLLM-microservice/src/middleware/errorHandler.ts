import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = Number(err?.status ?? 500);

  const message =
    err?.message?.toString?.() ||
    "Unexpected error";

  if (status >= 500) {
    console.error("[LocalLLM] error:", err);
  }

  res.status(status).json({
    success: false,
    error: message
  });
}
