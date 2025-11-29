import { Mail } from "../models/Mail";

export interface IAliveService{
    Alive():Promise<string>;
}