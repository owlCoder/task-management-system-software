import { NotificationCreateDTO } from '../../Domain/DTOs/NotificationCreateDTO';
import { NotificationUpdateDTO } from '../../Domain/DTOs/NotificationUpdateDTO';

export class NotificationValidation {
  
  /**
   * Validira CreateNotificationDTO
   * @returns null ako je validno, ili error poruka ako nije
   */
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

    const validTypes = ['info', 'warning', 'error'];
    if (!validTypes.includes(data.type)) {
      return `Type must be one of: ${validTypes.join(', ')}`;
    }

    if (data.userId !== undefined && (typeof data.userId !== 'number' || data.userId <= 0)) {
      return 'UserId must be a positive number';
    }

    return null; // Nema greške - validno!
  }

  /**
   * Validira UpdateNotificationDTO
   * @returns null ako je validno, ili error poruka ako nije
   */
  static validateUpdateDTO(data: any): string | null {
    if (!data || Object.keys(data).length === 0) {
      return 'Request body must contain at least one field to update';
    }

    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim() === '') {
        return 'Title must be a non-empty string';
      }
    }

    if (data.content !== undefined) {
      if (typeof data.content !== 'string' || data.content.trim() === '') {
        return 'Content must be a non-empty string';
      }
    }

    if (data.type !== undefined) {
      const validTypes = ['info', 'warning', 'error'];
      if (!validTypes.includes(data.type)) {
        return `Type must be one of: ${validTypes.join(', ')}`;
      }
    }

    if (data.isRead !== undefined && typeof data.isRead !== 'boolean') {
      return 'IsRead must be a boolean value';
    }

    return null; // Nema greške - validno!
  }

  /**
   * Validira ID parametar
   * @returns null ako je validno, ili error poruka ako nije
   */
  static validateId(id: any): string | null {
    const parsedId = parseInt(id);
    
    if (isNaN(parsedId) || parsedId <= 0) {
      return 'ID must be a positive number';
    }

    return null;
  }

  /**
   * Validira array ID-jeva (za bulk operacije)
   * @returns null ako je validno, ili error poruka ako nije
   */
  static validateIdsArray(ids: any): string | null {
    console.log('🔍 VALIDATION - validateIdsArray called with:', ids);
    console.log('🔍 VALIDATION - typeof ids:', typeof ids);
    console.log('🔍 VALIDATION - Array.isArray(ids):', Array.isArray(ids));
    
    if (!Array.isArray(ids)) {
      console.log('❌ VALIDATION - Not an array!');
      return 'IDs must be an array';
    }

    if (ids.length === 0) {
      console.log('❌ VALIDATION - Empty array!');
      return 'IDs array cannot be empty';
    }

    console.log('🔍 VALIDATION - Iterating through IDs...');
    for (const id of ids) {
      console.log('🔍 VALIDATION - Checking ID:', id, '| typeof:', typeof id, '| value > 0:', id > 0);
      if (typeof id !== 'number' || id <= 0) {
        console.log('❌ VALIDATION - Invalid ID detected:', id);
        return 'All IDs must be positive numbers';
      }
    }

    console.log('✅ VALIDATION - All IDs valid!');
    return null;
  }
}