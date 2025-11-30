export class MessageTemplate {
    private header: string;
    private footer: string;

    constructor() {
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