import { UserCreationDTO } from "../../Domain/DTOs/UserCreationDTO";
import { UserValidType } from "../../Domain/types/UserValidType";
import { UsernameValidation } from "./UsernameValidation";

export function UserDataValidation(
  UserData: Partial<UserCreationDTO>
): UserValidType {
  var poruka: string = "";

  var result = UsernameValidation(UserData.username);

  poruka = result.poruka ?? "";

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

  //Validacija role_name

  switch (UserData.role_name) {
    case "Admin":
      poruka = `Unauthorized user role: ${UserData.role_name}`;
      break;
    case "SysAdmin":
      poruka = `Unauthorized user role: ${UserData.role_name}`;
      break;
  }

  return {
    uspesno: poruka.length === 0,
    poruka,
  };
}


