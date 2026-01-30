import { UserDTO } from "../../models/users/UserDTO";

export type UserDetailProps = {
  user: UserDTO;
  onClose: () => void;
};