import { IUserAPI } from "../../api/users/IUserAPI";
import { UserDTO } from "../../models/users/UserDTO";

export type AddUserFormProps = {
  userAPI: IUserAPI;
  token: string;
  onUserAdded: (user: UserDTO) => void;
  onClose: () => void;
};