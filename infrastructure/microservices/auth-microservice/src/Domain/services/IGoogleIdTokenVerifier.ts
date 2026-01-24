import { GoogleUserInfo } from "../DTOs/GoogleUserInfoDTO";

export interface IGoogleIdTokenVerifier {
  verify(idToken: string): Promise<GoogleUserInfo | null>;
}
