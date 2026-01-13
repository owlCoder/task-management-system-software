import { OAuth2Client } from "google-auth-library";

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export class GoogleIdTokenVerifier {
  private readonly client = new OAuth2Client();

  constructor(private readonly audience: string) {}

  async verify(idToken: string): Promise<GoogleUserInfo> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.audience,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      throw new Error("Invalid Google token payload");
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
