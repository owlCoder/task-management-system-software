import { GoogleUserInfo } from "../types/GoogleUserInfo";

export interface IGoogleIdTokenVerifier {
  verify(idToken: string): Promise<GoogleUserInfo | null>;
}
