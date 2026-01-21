export interface IGC_Service{
    start():Promise<void>;
    stop():Promise<void>;
    collect(): Promise<void>
}