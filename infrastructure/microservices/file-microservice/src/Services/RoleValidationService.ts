import { IRoleValidationService } from '../Domain/services/IRoleValidationService';
import { UserRole } from '../Domain/enums/UserRole';
import { AllowedFileExtensions } from '../Domain/enums/AllowedFileExtensions';

export class RoleValidationService implements IRoleValidationService {
  
  getAllowedExtensions(role: UserRole): AllowedFileExtensions[] {
    switch (role) {
      case UserRole.ANIMATION_WORKER:
        return [
          AllowedFileExtensions.JPG,
          AllowedFileExtensions.JPEG,
          AllowedFileExtensions.PNG,
          AllowedFileExtensions.GIF,
          AllowedFileExtensions.BMP,
          AllowedFileExtensions.WEBP,
          AllowedFileExtensions.SVG,
          AllowedFileExtensions.MP4,
          AllowedFileExtensions.AVI,
          AllowedFileExtensions.MOV,
          AllowedFileExtensions.WMV,
          AllowedFileExtensions.FLV,
          AllowedFileExtensions.WEBM,
          AllowedFileExtensions.MKV
        ];
      
      case UserRole.AUDIO_MUSIC_STAGIST:
        return [
          AllowedFileExtensions.MP3,
          AllowedFileExtensions.WAV,
          AllowedFileExtensions.FLAC,
          AllowedFileExtensions.AAC,
          AllowedFileExtensions.OGG,
          AllowedFileExtensions.M4A,
          AllowedFileExtensions.WMA
        ];
      
      default:
        return [];
    }
  }

  isValidRole(role: string): boolean {
    return Object.values(UserRole).includes(role as UserRole);
  }
}