import { Mail } from "../../Domain/models/Mail";

export class MailValidator {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validate(mail: Mail): boolean {
    if (!this.emailRegex.test(mail.user)) {
      return false;
    }
    if (!mail.header || mail.header.trim().length === 0) {
      return false;
    }
    if (!mail.message || mail.message.trim().length === 0) {
      return false;
    }
    return true;
  }
}