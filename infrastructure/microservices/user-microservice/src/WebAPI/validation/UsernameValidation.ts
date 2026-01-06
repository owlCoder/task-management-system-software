import { UserValidType } from "../../Domain/types/UserValidType";

export function UsernameValidation(
  username: string | undefined
): UserValidType {
  const trimmedUsername = username?.trim() ?? "";//ako je undifend vraca ""
  var poruka: string = "";

  // Validacija username-a
  if (!trimmedUsername) {
    poruka = "Username must not be empty.";
  } else if (trimmedUsername.length < 3) {
    poruka = "Username must be longer than 3 characters";
  } else if (trimmedUsername.length > 15) {
    poruka = "Username must be shorter than 15 characters";
  }

  return {
    uspesno: poruka.length === 0,
    poruka,
  };
}
