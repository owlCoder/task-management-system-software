import cors from "cors";

 // samo gateway moze pristupiti mikroservisu
export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5000"],
  methods: process.env.CORS_METHODS?.split(",").map((m) => m.trim()) || ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
});