import Mailjet from "node-mailjet";
import dotenv from "dotenv";

export const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY as string,
  process.env.MAILJET_API_SECRET as string
);