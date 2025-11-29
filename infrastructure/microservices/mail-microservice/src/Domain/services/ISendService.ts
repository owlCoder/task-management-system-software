import { Mail } from "../models/Mail";

export interface ISendService{
    SendMessage(mail:Mail):Promise<string>;
}