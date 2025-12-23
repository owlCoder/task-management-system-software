import { MailTypes } from "../enums/EMailTypes";

export class MessageTemplate {
    private header: string;
    private footer: string;

    constructor(type?: number) {
        if (type === undefined || type < 0 || type > 3) {
            this.header = `
        <div style="padding: 20px; background: #f5f5f5; font-family: Arial; border-bottom: 1px solid #ddd;">
            <h2 style="margin: 0; color: #333;">📩 Task Management System</h2>
        </div>
        `;

            this.footer = `
        <div style="padding: 20px; background: #f5f5f5; font-family: Arial; border-top: 1px solid #ddd; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 12px;">Ovo je automatska poruka — molimo vas da ne odgovarate na nju.</p>
            <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} Task Management System</p>
        </div>
        `;
        }
        switch (type) {

            case MailTypes.PasswordReset:
                this.header = `
            <div style="padding: 20px; background: #fff3cd; font-family: Arial; border-bottom: 1px solid #ffeeba;">
                <h2 style="margin: 0; color: #856404;">🔐 Password Reset</h2>
            </div>
            `;

                this.footer = `
                <div style="padding: 20px; background: #fff3cd; font-family: Arial; border-top: 1px solid #ffeeba; margin-top: 20px;">
                    <p style="margin: 0; color: #856404; font-size: 12px;">
                        Ukoliko niste zatražili reset lozinke, možete bezbedno ignorisati ovu poruku.
                    </p>
                    <p style="margin: 0; color: #856404; font-size: 12px;">
                        © ${new Date().getFullYear()} Task Management System
                    </p>
                </div>
                `;
                break;
            case MailTypes.Info:
                this.header = `
                <div style="padding: 20px; background: #e7f3ff; font-family: Arial; border-bottom: 1px solid #b3d7ff;">
                    <h2 style="margin: 0; color: #0b5ed7;">ℹ️ System Information</h2>
                </div>
                `;

                this.footer = `
            <div style="padding: 20px; background: #e7f3ff; font-family: Arial; border-top: 1px solid #b3d7ff; margin-top: 20px;">
                <p style="margin: 0; color: #0b5ed7; font-size: 12px;">
                    Ovo je informativna poruka sistema.
                </p>
                <p style="margin: 0; color: #0b5ed7; font-size: 12px;">
                    © ${new Date().getFullYear()} Task Management System
                </p>
            </div>
            `;
                break;
            case MailTypes.Promo:
                this.header = `
            <div style="padding: 20px; background: linear-gradient(90deg, #ff6a00, #ee0979); font-family: Arial; border-bottom: 1px solid #ddd;">
                <h2 style="margin: 0; color: #ffffff;">🎉 Special Offer</h2>
            </div>
            `;

                this.footer = `
            <div style="padding: 20px; background: #fff0f6; font-family: Arial; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="margin: 0; color: #555; font-size: 12px;">
                    Ovu poruku ste primili jer ste se prijavili na naša obaveštenja.
                </p>
                <p style="margin: 0; color: #555; font-size: 12px;">
                    Ukoliko ne želite da primate ovakve poruke, možete se odjaviti u podešavanjima naloga.
                </p>
                <p style="margin: 0; color: #555; font-size: 12px;">
                    © ${new Date().getFullYear()} Task Management System
                </p>
            </div>
            `;
                break;
            default:
                {
                    this.header = `
            <div style="padding: 20px; background: #f5f5f5; font-family: Arial; border-bottom: 1px solid #ddd;">
                <h2 style="margin: 0; color: #333;">📩 Task Management System</h2>
            </div>
            `;

                    this.footer = `
            <div style="padding: 20px; background: #f5f5f5; font-family: Arial; border-top: 1px solid #ddd; margin-top: 20px;">
                <p style="margin: 0; color: #666; font-size: 12px;">Ovo je automatska poruka — molim vas da ne odgovarate na nju.</p>
                <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} Task Management System</p>
            </div>
            `;
                }
        }
    }

    public build(message: string): string {
        return `
        <html>
        <body style="font-family: Arial; background-color: #ffffff; padding: 0; margin: 0;">
            ${this.header}

            <div style="padding: 20px; font-size: 16px; color: #333;">
                ${message}
            </div>

            ${this.footer}
        </body>
        </html>
        `;
    }
}