import { randomInt } from "crypto";
import { IOTPGenerator } from "../../Domain/services/IOTPGenerator";

export class OTPGenerator implements IOTPGenerator {
  generateOTP(): string {
    return randomInt(0, 100000000).toString().padStart(8, '0');
  }
}