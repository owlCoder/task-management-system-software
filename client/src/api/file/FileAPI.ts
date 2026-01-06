import axios, { AxiosInstance } from "axios";
import { FileDTO } from "../../models/file/FileDTO";
import { IFileAPI } from "./IFileAPI";

export class FileAPI  implements IFileAPI{
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
    });
  }

   async deleteFile(token: string, id: number): Promise<void> {
       await this.axiosInstance.delete(`/files/${id}`, {
            headers : {Authorization: `Bearer ${token}`}
        });
    }

    async getFileList(token: string , authorId : number): Promise<FileDTO[]> {
        const response = await this.axiosInstance.get(
            `/files/author/${authorId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            });
        return response.data.data;
    }

      async downloadFile(token: string, id: number): Promise<Blob> {
        return (await this.axiosInstance.get<Blob>(`/files/download/${id}`,{
            headers: { Authorization: `Bearer ${token}`},
            responseType:"blob",
        }
        )).data;
    }


  async uploadFile(token: string,file: File,authorId: number): Promise<number> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("authorId", authorId.toString());

    const response = await this.axiosInstance.post(
      "/files/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data.data.fileId;
  }
}
