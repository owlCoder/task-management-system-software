import { ILogerService } from "../Domain/services/ILogerService";

export class LogerService implements ILogerService {
  constructor() {
    console.log(`\x1b[35m[Logger@1.45.4]\x1b[0m Service started`);
  }
  async err(
    service: string,
    code: string,
    url: string,
    method: string,
    msg: string,
  ): Promise<void> {
    console.log(`\x1b[35m[Logger@1.45.4]\x1b[0m ${msg}`);
  }

  async log(message: string): Promise<boolean> {
    console.log(`\x1b[35m[Logger@1.45.4]\x1b[0m ${message}`);
    return true;
  }
}
