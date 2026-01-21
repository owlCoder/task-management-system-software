import { Router } from "express";
import { chat } from "../controllers/llmController.js";

export const llmRoutes = Router();

llmRoutes.post("/chat", chat);
