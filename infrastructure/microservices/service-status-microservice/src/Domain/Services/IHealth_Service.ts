export interface IHealth_Service{
    start():Promise<void>;
    stop():Promise<void>;
    ping(ms: RuntimeMicroservice): Promise<void>
}