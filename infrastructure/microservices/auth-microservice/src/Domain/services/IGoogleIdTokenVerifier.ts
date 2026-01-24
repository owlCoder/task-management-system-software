import { GoogleUserInfoDTO } from "../DTOs/GoogleUserInfoDTO";

export interface IGoogleIdTokenVerifier {
  verify(idToken: string): Promise<GoogleUserInfoDTO | null>;
}
