export interface ILogerService {
  err(
    service: string,
    code: string,
    url: string,
    method: string,
    msg: string
  ): Promise<void>;

  log(message: string): Promise<boolean>;
}