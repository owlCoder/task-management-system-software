import { IAliveService } from "../Domain/services/IAliveService";


export class AliveService implements IAliveService{
    Alive(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}