// Domain
import { CreateFileDTO } from "../../../Domain/DTOs/file/CreateFileDTO";

/**
 * Generates the form data for file upload operation.
 * @param {CreateFileDTO} fileData - metadata and content of the file.
 * @returns {FormData} file data inside of a form.
 */
export function generateFileFormData(fileData: CreateFileDTO): FormData {
    const formData = new FormData();

    if(fileData.fileBuffer){
        const dataArray = new Uint8Array(fileData.fileBuffer);
        const blob = new Blob([dataArray], {type: fileData.fileType });
        formData.append('file', blob, fileData.originalFileName);
    }

    if(fileData.authorId){
        formData.append('authorId', fileData.authorId.toString());
    }

    return formData;
}