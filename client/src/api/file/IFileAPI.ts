import { FileDTO } from "../../models/file/FileDTO";

export interface IFileAPI{
    getFileList ( token:string , authorId :number) : Promise<FileDTO[]>;
    downloadFile ( token:string, id:number ) : Promise<Blob>;
    deleteFile ( token:string, id:number) : Promise<void>;
}

