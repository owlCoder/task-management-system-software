import { IAuthAPI } from "../api/auth/IAuthAPI";

export interface LoginFormProps {
  authAPI: IAuthAPI;
  onSwitchToRegister?: () => void;
}
