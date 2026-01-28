import { Mail } from "../Domain/models/Mail";
import { mailjet } from "../Domain/models/MailJet";
import { MessageTemplate } from "../Domain/models/MessageTemplate";
import { ISendService } from "../Domain/services/ISendService";
import axios from "axios";
import jwt from "jsonwebtoken";

export class SendService implements ISendService{


 async SendMessage(mail : Mail) {
  try {
    const template = new MessageTemplate(mail.type);
    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER_EMAIL,
              Name: process.env.MAILJET_SENDER_NAME,
            },
            To: [
              {
                Email: mail.user,
              }
            ],
            Subject: mail.header,
            HTMLPart: template.build(mail.message)
          }
        ]
      });

    console.log("Mailjet response:", result.body);

    // Posalji notifikaciju kroz gateway
    if (mail.userId) {
      try {
        const gatewayUrl = (process.env.GATEWAY_URL || "http://localhost:4000/").replace(/\/+$/, "");
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
          console.error("JWT_SECRET is not set. Notification will not be sent.");
        } else {
          const token = jwt.sign(
            {
              id: mail.userId,
              username: mail.user,
              email: mail.user,
              role: "Admin",
            },
            jwtSecret
          );

          await axios.post(
            `${gatewayUrl}/api/v1/notifications`,
            {
              userIds: [mail.userId],
              title: "Email sent successfully",
              content: `Your email \"${mail.header}\" was sent to ${mail.user}`,
              type: "info",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (notifyError) {
        if (axios.isAxiosError(notifyError)) {
          console.error("Failed to send notification:", {
            status: notifyError.response?.status,
            data: notifyError.response?.data,
          });
        } else {
          console.error("Failed to send notification:", notifyError);
        }
      }
    }

    return "Success";
  } catch (error) {
    return "Mailjet error:";
  }
}
}
