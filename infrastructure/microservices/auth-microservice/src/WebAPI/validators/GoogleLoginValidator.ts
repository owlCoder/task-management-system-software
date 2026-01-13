export function validateGoogleLoginData(data: any): { success: boolean; message?: string } {
  if (!data || typeof data.idToken !== "string" || data.idToken.trim().length < 20) {
    return { success: false, message: "idToken is required." };
  }
  return { success: true };
}
