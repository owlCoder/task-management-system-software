# Role-Based File Type Restrictions

This implementation adds role-based file type restrictions to the file microservice. Users can only upload specific file types based on their role.

## Roles and Allowed File Types

### Animation Worker
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .webp, .svg
- **Videos**: .mp4, .avi, .mov, .wmv, .flv, .webm, .mkv

### Audio & Music Stagist
- **Audio**: .mp3, .wav, .flac, .aac, .ogg, .m4a, .wma

## Architecture

### Enums
- `UserRole`: Defines the available user roles
- `AllowedFileExtensions`: Defines all supported file extensions

### Services
- `RoleValidationService`: Validates roles and returns allowed extensions for each role
- `FileTypeValidationService`: Uses the `file-type` library to validate actual file content

### Implementation Details

1. **Role Header**: User role is passed via `x-user-role` header from the gateway
2. **File Type Detection**: Uses `file-type` library to detect actual file type from buffer content
3. **Validation Flow**:
   - Check if role is valid
   - Get allowed extensions for the role
   - Validate file buffer against allowed extensions
   - Proceed with upload if validation passes

### API Usage

```typescript
// Upload endpoint with role validation
POST /api/v1/files/upload
Headers: {
  "x-user-role": "Animation Worker" | "Audio & Music Stagist"
}
Body: {
  authorId: number,
  file: File (multipart/form-data)
}
```

### Error Responses

- `400`: Invalid role, missing role, or file type not allowed for role
- `500`: Server error during validation or upload
