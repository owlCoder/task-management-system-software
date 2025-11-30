import { Mail } from "../Domain/models/Mail";
import { mailjet } from "../Domain/models/MailJet";
import { ISendService } from "../Domain/services/ISendService";

export class SendService implements ISendService{

 async SendMessage(mail : Mail) {
  try {
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
            HTMLPart: mail.message
          }
        ]
      });

    console.log("Mailjet response:", result.body);
    return "Success";
  } catch (error) {
    return "Mailjet error:";
  }
}
}
