import axios from "axios";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type LmStudioChatResponse = {
  id?: string;
  model?: string;
  choices?: Array<{ message?: { role?: string; content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

function requireEnv(name: string): string {
  const v = (process.env[name] ?? "").trim();
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const LMSTUDIO_BASE_URL = requireEnv("LMSTUDIO_BASE_URL"); // e.g. http://127.0.0.1:1234/v1
const LMSTUDIO_MODEL = requireEnv("LMSTUDIO_MODEL");       // e.g. gemma-3-1b-it
const LMSTUDIO_TIMEOUT_MS = Number(process.env.LMSTUDIO_TIMEOUT_MS ?? 60000);

const http = axios.create({
  baseURL: LMSTUDIO_BASE_URL,
  timeout: LMSTUDIO_TIMEOUT_MS
});

export async function chatCompletion(args: {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}): Promise<{ text: string; raw: LmStudioChatResponse; modelUsed: string }> {
  const payload = {
    model: LMSTUDIO_MODEL,
    messages: args.messages,
    temperature: args.temperature ?? 0.2,
    max_tokens: args.max_tokens ?? 512
  };

  const { data } = await http.post<LmStudioChatResponse>("/chat/completions", payload);

  const text = data?.choices?.[0]?.message?.content?.toString?.() ?? "";

  return { text, raw: data, modelUsed: LMSTUDIO_MODEL };
}
