import { User } from "../../Domain/models/User";
import { UserValidType } from "../../Domain/types/UserValidType";
import { UsernameValidation } from "./UsernameValidation";

export function UserDataUpdateValidation(
  UserData: Partial<User>
): UserValidType {
  var poruka: string = "";

  // Validacija username-a
  var result = UsernameValidation(UserData.username);

  poruka = result.poruka ?? "";

  //Validacija email-a
  if (
    UserData.email &&
    UserData.email.match("[a-zA-Z0-9]+@[a-z]+.[a-z]+") === null
  ) {
    poruka = "You did not enter an email in the correct format!";
  }

  //Validacija role_name
  if (UserData.user_role) {
    switch (UserData.user_role.role_name) {
      case "Admin":
        poruka = `Unauthorized user role: ${UserData.user_role.role_name}`;
        break;
      case "SysAdmin":
        poruka = `Unauthorized user role: ${UserData.user_role.role_name}`;
        break;
    }
  }

  return {
    uspesno: poruka.length === 0,
    poruka,
  };
}
