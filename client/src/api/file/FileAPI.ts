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
       try {
         await this.axiosInstance.delete(`/files/${id}`, {
              headers : {Authorization: `Bearer ${token}`}
          });
       } catch (error) {
         console.error('Error deleting file:', error);
         throw error;
       }
    }

    async getFileList(token: string , authorId : number, offset?: number, limit?: number): Promise<FileDTO[]> {
        try {
          let url = `/files/author/${authorId}`;

          // Build query string for pagination parameters
          const queryParams = new URLSearchParams();
          if (offset !== undefined) {
              queryParams.append('offset', offset.toString());
          }
          if (limit !== undefined) {
              queryParams.append('limit', limit.toString());
          }

          if (queryParams.toString()) {
              url += `?${queryParams.toString()}`;
          }

          const response = await this.axiosInstance.get(
              url,
              {
                  headers: { Authorization: `Bearer ${token}` },
              });
          return response.data.data;
        } catch (error) {
          console.error('Error fetching file list:', error);
          throw error;
        }
    }

      async downloadFile(token: string, id: number): Promise<Blob> {
        try {
          return (await this.axiosInstance.get<Blob>(`/files/download/${id}`,{
              headers: { Authorization: `Bearer ${token}`},
              responseType:"blob",
          }
          )).data;
        } catch (error) {
          console.error('Error downloading file:', error);
          throw error;
        }
    }


  async uploadFile(token: string,file: File,authorId: number): Promise<number> {
    try {
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
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}
