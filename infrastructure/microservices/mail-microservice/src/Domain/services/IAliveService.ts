import { Mail } from "../models/Mail";

export interface IAuthService{
    Alive():Promise<string>;
}