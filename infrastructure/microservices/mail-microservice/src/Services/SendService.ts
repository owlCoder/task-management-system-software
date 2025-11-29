import nodemailer from "nodemailer";
import { ISendService } from "../Domain/services/ISendService";
import { Mail } from "../Domain/models/Mail";

    //TODO ovo staviti u odvojen model!
    const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!
    }
    });

export class SendService implements ISendService{
    async SendMessage(mail: Mail): Promise<string> {
    try{
        await transporter.sendMail({
        from: '"Support"',
        to: "markodragojevicc@gmail.com",
        subject: "Resetovanje lozinke",
        html: `
        <p>Samo želim da znam dal ćeš ostati sam....:</p>
        `
        });
        return "Mail sent!";
    }
    
    catch{
        return "Error";
    }
}
    
}
