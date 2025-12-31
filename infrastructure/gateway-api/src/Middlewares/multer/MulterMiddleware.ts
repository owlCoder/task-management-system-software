// Framework
import { Request, Response, NextFunction } from "express";

// Libraries
import multer, { Multer } from "multer";

// Infrastructure
import { logger } from "../../Infrastructure/logging/Logger";

/**
 * Middleware wrapper for Multer file uploads that handles errors gracefully.
 * Executes a single-file Multer upload for the given field name.
 * @param {Multer} upload - The Multer instance configured with storage and size limits.
 * @param {string} fieldName - The name of the file field expected in the request (e.g. "file").
 * @param {number} maxFileSizeMB - Max size of a file in megabytes.
 * @returns Express middleware function.
 */
export const multerHandler = (upload: Multer, fieldName: string, maxFileSizeMB: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                let message: string;

                switch (err.code) {
                    case "LIMIT_FILE_SIZE":
                        message = `File too large, maximum size is ${maxFileSizeMB}MB`;
                        break;
                    case "LIMIT_FILE_COUNT":
                        message = "Too many files uploaded";
                        break;
                    case "LIMIT_UNEXPECTED_FILE":
                        message = `Unexpected field name, expected '${fieldName}'`;
                        break;
                    default:
                        message = err.message;
                }

                logger.warn({
                    service: "Gateway",
                    code: err.code,
                    method: req.method,
                    url: req.url,
                    ip: req.ip
                }, message);

                return res.status(400).json({ message: message });
            }
            
            if (err) {
                const message = "Unexpected upload error";

                logger.error({
                    service: "Gateway",
                    code: "FILE_UPLOAD_ERR",
                    method: req.method,
                    url: req.url,
                    ip: req.ip
                }, message);

                return res.status(500).json({ message: message });
            }

            next();
        });
    };
};