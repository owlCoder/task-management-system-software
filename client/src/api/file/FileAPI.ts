import axios,{AxiosInstance} from "axios";
import { IFileAPI } from "./IFileAPI";
import { FileDTO } from "../../models/file/FileDTO";

export class FileAPI implements IFileAPI{
    private readonly axiosInstance:AxiosInstance;

    constructor()
    {
        this.axiosInstance=axios.create({
            baseURL:import.meta.env.VITE_GATEWAY_URL,
            headers:{"Content-Type":"application/json"}
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
        return (await this.axiosInstance.get<Blob>(`/files/${id}/download`,{
            headers: { Authorization: `Bearer ${token}`},
            responseType:"blob",
        }
        )).data;
    }

    async deleteFile(token: string, id: number): Promise<void> {
        return (await this.axiosInstance.delete(`/files/${id}`, {
            headers : {Authorization: `Bearer ${token}`}
        })).data;
    }
}