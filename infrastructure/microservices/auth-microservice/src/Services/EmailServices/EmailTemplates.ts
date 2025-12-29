export class EmailTemplates {
  static getOTPLoginSubject(username: string): string {
    return `Your OTP Code for Login for user ${username}`;
  }

  static getOTPLoginBody(username: string, otpCode: string, expirationMinutes: number): string {
    return `
      <p>Dear ${username},</p>

      <p>
        You have requested to log in to your account. Please use the following One-Time Password (OTP)
        to complete the verification process:
      </p>

      <p><strong>OTP Code:</strong> ${otpCode}</p>

      <p>This code is valid for ${expirationMinutes} minutes. Do not share it with anyone.</p>

      <p>If you did not request this, please ignore this email or contact support.</p>
    `;
  }
}