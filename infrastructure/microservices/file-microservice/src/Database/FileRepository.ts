import { IFileRepository } from '../Domain/services/IFileRepository';
import { UploadedFile } from '../Domain/models/UploadedFile';
import { Result } from '../Domain/types/Result';
import Database from './Database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class FileRepository implements IFileRepository {
  private database: Database;

  constructor() {
    this.database = Database.getInstance();
  }

  async create(file: UploadedFile): Promise<Result<UploadedFile>> {
    try {
      const connection = await this.database.getConnection();
      
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO uploaded_files (original_file_name, file_type, file_extension, author_id, path_to_file) 
         VALUES (?, ?, ?, ?, ?)`,
        [file.originalFileName, file.fileType, file.fileExtension, file.authorId, file.pathToFile]
      );

      const createdFile: UploadedFile = {
        ...file,
        fileId: result.insertId
      };

      return { success: true, data: createdFile };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async getById(fileId: number): Promise<Result<UploadedFile | null>> {
    try {
      const connection = await this.database.getConnection();
      
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM uploaded_files WHERE file_id = ?',
        [fileId]
      );

      if (rows.length === 0) {
        return { success: true, data: null };
      }

      const row = rows[0];
      const file: UploadedFile = {
        fileId: row.file_id,
        originalFileName: row.original_file_name,
        fileType: row.file_type,
        fileExtension: row.file_extension,
        authorId: row.author_id,
        pathToFile: row.path_to_file
      };

      return { success: true, data: file };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to retrieve file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async delete(fileId: number): Promise<Result<boolean>> {
    try {
      const connection = await this.database.getConnection();
      
      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM uploaded_files WHERE file_id = ?',
        [fileId]
      );

      return { success: true, data: result.affectedRows > 0 };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async getByAuthorId(authorId: number): Promise<Result<UploadedFile[]>> {
    try {
      const connection = await this.database.getConnection();
      
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM uploaded_files WHERE author_id = ?',
        [authorId]
      );

      const files: UploadedFile[] = rows.map(row => ({
        fileId: row.file_id,
        originalFileName: row.original_file_name,
        fileType: row.file_type,
        fileExtension: row.file_extension,
        authorId: row.author_id,
        pathToFile: row.path_to_file
      }));

      return { success: true, data: files };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to retrieve files: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}