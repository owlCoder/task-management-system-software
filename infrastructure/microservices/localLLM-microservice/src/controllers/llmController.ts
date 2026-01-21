import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { looksLikeEnglish } from "../utils/detectEnglish";
import { chatCompletion, type ChatMessage } from "../clients/lmstudioClient";

type ChatRequestBody = {
  prompt: string;
  system?: string;
  temperature?: number;
  max_tokens?: number;
};

function requireInternalAuth(req: Request) {
  const enforceInternalAuth = (process.env.ENFORCE_INTERNAL_AUTH ?? "true").toLowerCase() === "true";
  if (!enforceInternalAuth) return;

  const internalApiKey = (process.env.INTERNAL_API_KEY ?? "").trim();
  if (!internalApiKey) {
    throw Object.assign(new Error("Server misconfigured: INTERNAL_API_KEY is empty"), { status: 500 });
  }

  const provided = (req.header("x-internal-api-key") ?? "").trim();
  if (!provided || provided !== internalApiKey) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
}

export const chat = asyncHandler(async (req: Request, res: Response) => {
  requireInternalAuth(req);

  const body = req.body as ChatRequestBody;
  const prompt = (body?.prompt ?? "").trim();

  if (!prompt) {
    res.status(400).json({ success: false, error: "prompt is required" });
    return;
  }

  const enforceEnglish = (process.env.ENFORCE_ENGLISH ?? "true").toLowerCase() === "true";
  if (enforceEnglish && !looksLikeEnglish(prompt)) {
    res.status(400).json({
      success: false,
      error: "Prompt must be in English (spec requirement)."
    });
    return;
  }

  const system = (body?.system ?? "You are a helpful assistant. Respond concisely.").trim();

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: prompt }
  ];

  const { text, raw, modelUsed } = await chatCompletion({
    messages,
    temperature: body.temperature,
    max_tokens: body.max_tokens
  });

  res.json({
    success: true,
    model: raw?.model ?? modelUsed,
    text,
    usage: raw?.usage ?? null
  });
});
