import {  VALID_NOTIFICATION_TYPES, isValidNotificationType } from '../../Utils/ValidNotificationHelpers/ValidNotificationType';

export class NotificationValidation {

  //null ako je validno, ili error poruka ako nije
  static validateCreateDTO(data: any): string | null {
    if (!data) {
      return 'Request body is required';
    }

    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      return 'Title is required and must be a non-empty string';
    }

    if (!data.content || typeof data.content !== 'string' || data.content.trim() === '') {
      return 'Content is required and must be a non-empty string';
    }

    if (!data.type) {
      return 'Type is required';
    }

    if (!isValidNotificationType(data.type)) {
      return `Type must be one of: ${VALID_NOTIFICATION_TYPES.join(', ')}`;
    }

    if (!data.userIds || !Array.isArray(data.userIds)) {
      return 'UserIds must be an array';
    }

    if (data.userIds.length === 0) {
      return 'UserIds array cannot be empty';
    }

    for (const userId of data.userIds) {
      if (typeof userId !== 'number' || userId <= 0) {
        return 'All userIds must be positive numbers';
      }
    }

    return null; 
  }

  // null ako je validno, ili error poruka ako nije
  static validateId(id: any): string | null {
    const parsedId = parseInt(id);
    
    if (isNaN(parsedId) || parsedId <= 0) {
      return 'ID must be a positive number';
    }

    return null;
  }

  // null ako je validno, ili error poruka ako nije
  static validateIdsArray(ids: any): string | null {
    console.log(' VALIDATION - validateIdsArray called with:', ids);
    console.log(' VALIDATION - typeof ids:', typeof ids);
    console.log(' VALIDATION - Array.isArray(ids):', Array.isArray(ids));
    
    if (!Array.isArray(ids)) {
      console.log(' VALIDATION - Not an array!');
      return 'IDs must be an array';
    }

    if (ids.length === 0) {
      console.log(' VALIDATION - Empty array!');
      return 'IDs array cannot be empty';
    }

    console.log(' VALIDATION - Iterating through IDs...');
    for (const id of ids) {
      console.log(' VALIDATION - Checking ID:', id, '| typeof:', typeof id, '| value > 0:', id > 0);
      if (typeof id !== 'number' || id <= 0) {
        console.log(' VALIDATION - Invalid ID detected:', id);
        return 'All IDs must be positive numbers';
      }
    }

    console.log(' VALIDATION - All IDs valid!');
    return null;
  }
}