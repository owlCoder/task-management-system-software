import { UserRole } from '../enums/UserRole';
import { AllowedFileExtensions } from '../enums/AllowedFileExtensions';

export interface IRoleValidationService {
  getAllowedExtensions(role: UserRole): AllowedFileExtensions[];
  isValidRole(role: string): boolean;
}