import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export interface UploadResult {
    key: string;      // Jedinstveni ključ fajla u bucket-u
    url: string;      // Javni URL za pristup slici
}

export interface IR2StorageService {
    uploadImage(
        fileBuffer: Buffer,
        originalFilename: string,
        mimeType: string
    ): Promise<UploadResult>;
    deleteImage(key: string): Promise<boolean>;
    getPublicUrl(key: string): string;
}

export class R2StorageService implements IR2StorageService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly publicUrl: string;

    constructor() {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        
        if (!accountId || !accessKeyId || !secretAccessKey) {
            throw new Error("R2 configuration is missing. Check environment variables.");
        }

        this.bucketName = process.env.R2_BUCKET_NAME || "project-images";
        this.publicUrl = process.env.R2_PUBLIC_URL || "";

        this.s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
    }

    /**
     * Upload slike na R2 storage
     */
    async uploadImage(
        fileBuffer: Buffer,
        originalFilename: string,
        mimeType: string
    ): Promise<UploadResult> {
        // Generiši jedinstveno ime fajla
        const extension = this.getExtension(originalFilename);
        const key = `projects/${uuidv4()}${extension}`;

        const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
            // Cache control za optimizaciju
            CacheControl: "public, max-age=31536000",
        };

        try {
            await this.s3Client.send(new PutObjectCommand(params));
            
            return {
                key: key,
                url: this.getPublicUrl(key),
            };
        } catch (error) {
            console.error("R2 upload error:", error);
            throw new Error("Failed to upload image to storage");
        }
    }

    /**
     * Briše sliku sa R2 storage-a
     */
    async deleteImage(key: string): Promise<boolean> {
        if (!key) return true;

        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                })
            );
            return true;
        } catch (error) {
            console.error("R2 delete error:", error);
            return false;
        }
    }

    /**
     * Vraća javni URL za sliku
     */
    getPublicUrl(key: string): string {
        if (!key) return "";
        return `${this.publicUrl}/${key}`;
    }

    private getExtension(filename: string): string {
        const lastDot = filename.lastIndexOf(".");
        if (lastDot === -1) return "";
        return filename.substring(lastDot).toLowerCase();
    }
}