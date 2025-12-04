import { UserCreationDTO } from "../../Domain/DTOs/UserCreationDTO";
import { User } from "../../Domain/models/User";
import { UserRole } from "../../Domain/models/UserRole";
import { UserValidType } from "../../Domain/types/UserValidType";

export function UserDataValidation(
  UserData: Partial<UserCreationDTO>
): UserValidType {
  var poruka: string = "";

  // Validacija username-a
  if (!UserData.username || UserData.username.trim() === "") {
    poruka = "Username must not be empty.";
  } else if (UserData.username.length < 3) {
    poruka = "Username must be longer than 3 characters";
  } else if (UserData.username.length > 15) {
    poruka = "Username must be shorter than 15 characters";
  }

  // Validacija password-a
  if (!UserData.password || UserData.password.trim() === "") {
    poruka = "Password must not be empty.";
  } else if (UserData.password.length < 3) {
    poruka = "Password must be longer than 3 characters";
  }

  //Validacija email-a
  if (
    UserData.email &&
    UserData.email.match("[a-zA-Z0-9]+@[a-z]+.[a-z]+") === null
  ) {
    poruka = "You did not enter an email in the correct format!";
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
    poruka = "Username must not be empty.";
  } else if (UserData.username.length < 3) {
    poruka = "Username must be longer than 3 characters";
  } else if (UserData.username.length > 15) {
    poruka = "Username must be shorter than 15 characters";
  }

  //Validacija email-a
  if (
    UserData.email &&
    UserData.email.match("[a-zA-Z0-9]+@[a-z]+.[a-z]+") === null
  ) {
    poruka = "You did not enter an email in the correct format!";
  }

  return {
    uspesno: poruka.length === 0,
    poruka,
  };
}
