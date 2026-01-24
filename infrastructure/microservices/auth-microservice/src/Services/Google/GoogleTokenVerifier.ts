import { OAuth2Client } from "google-auth-library";
import { GoogleUserInfoDTO } from "../../Domain/DTOs/GoogleUserInfoDTO";
import { IGoogleIdTokenVerifier } from "../../Domain/services/IGoogleIdTokenVerifier";

export class GoogleIdTokenVerifier implements IGoogleIdTokenVerifier {
  private readonly client = new OAuth2Client();

  constructor(private readonly audience: string) {}

  async verify(idToken: string): Promise<GoogleUserInfoDTO | null>{
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.audience,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified,
      name: payload.name,
      picture: payload.picture,
    };
  }
}
