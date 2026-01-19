import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export interface IR2StorageService {
    uploadImage(buffer: Buffer, originalName: string, mimeType: string): Promise<{ key: string; url: string }>;
    deleteImage(key: string): Promise<void>;
}

export class R2StorageService implements IR2StorageService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly publicUrl: string;

    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME || "";
        this.publicUrl = process.env.R2_PUBLIC_URL || "";

        console.log("R2 Config:", {
        endpoint: process.env.R2_ENDPOINT,
        bucket: this.bucketName,
        publicUrl: this.publicUrl,
        hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
    });

        this.s3Client = new S3Client({
            region: "auto",
            endpoint: process.env.R2_ENDPOINT || "",
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
            },
        });
    }

    async uploadImage(buffer: Buffer, originalName: string, mimeType: string): Promise<{ key: string; url: string }> {
        const extension = originalName.split(".").pop() || "jpg";
        const key = `users/${uuidv4()}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        });

        await this.s3Client.send(command);

        const url = `${this.publicUrl}/${key}`;

        return { key, url };
    }

    async deleteImage(key: string): Promise<void> {
        if (!key) return;

        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            console.error("Failed to delete image from R2:", error);
        }
    }
}