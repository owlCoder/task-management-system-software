import { User } from "../../Domain/models/User";
import { UserRole } from "../../Domain/models/UserRole";
import { UserValidType } from "../../Domain/types/UserValidType";

export function UserDataValidation(UserData: Partial<User>): UserValidType {
  var poruka: string = "";

  // Validacija username-a
  if (!UserData.username || UserData.username.trim() === "") {
    poruka = "Username ne sme biti prazan.";
  } else if (UserData.username.length < 3) {
    poruka = "Username mora imati najmanje 3 karaktera.";
  } else if (UserData.username.length > 15) {
    poruka = "Username ne sme imati više od 15 karaktera.";
  }

  // Validacija password-a
  if (!UserData.password_hash || UserData.password_hash.trim() === "") {
    poruka = "Password ne sme biti prazan.";
  } else if (UserData.password_hash.length < 3) {
    poruka = "Password mora imati najmanje 3 karaktera.";
  } else if (UserData.password_hash.length > 15) {
    poruka = "Password ne sme imati više od 15 karaktera.";
  }

  //Validacija email-a
  if (
    UserData.email &&
    UserData.email.match("[a-zA-Z0-9]+@[a-z]+.com") === null
  ) {
    poruka = "Niste uneli email u dobrom formatu!";
  }

  return {
    uspesno: poruka.length === 0,
    poruka,
  };
}

export function UserDataUpdateValidation(
  UserData: Partial<User>
): UserValidType {
  var poruka: string = "";

  // Validacija username-a
  if (!UserData.username || UserData.username.trim() === "") {
    poruka = "Username ne sme biti prazan.";
  } else if (UserData.username.length < 3) {
    poruka = "Username mora imati najmanje 3 karaktera.";
  } else if (UserData.username.length > 15) {
    poruka = "Username ne sme imati više od 15 karaktera.";
  }

  //Validacija email-a
  if (
    UserData.email &&
    UserData.email.match("[a-zA-Z0-9]+@[a-z]+.com") === null
  ) {
    poruka = "Niste uneli email u dobrom formatu!";
  }

  return {
    uspesno: poruka.length === 0,
    poruka,
  };
}
