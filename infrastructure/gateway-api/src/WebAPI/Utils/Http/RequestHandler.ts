// Framework
import { Request } from "express";

// Libraries
import path from "path";

// Domain
import { CreateFileDTO } from "../../../Domain/DTOs/file/CreateFileDTO";

/**
 * Extracts the data of the file that is being uploaded, from the request object.
 * @param {Request} req - The request object, containing the file metadata and content.
 * @returns File metadata and content as {@link CreateFileDTO}.
 */
export function extractFileDataFromRequest(req: Request): CreateFileDTO {
    const file = req.file;
    const authorId = parseInt(req.body?.authorId);
    const originalFileName = req.file?.originalname ?? "";
    const fileExtension = path.extname(originalFileName);
    const fileType = req.file?.mimetype ?? "";

    return {
        originalFileName: originalFileName,
        fileType: fileType,
        fileExtension: fileExtension,
        authorId: authorId,
        fileBuffer: file?.buffer
    }
}