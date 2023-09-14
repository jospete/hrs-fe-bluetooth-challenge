import { ErrorHandler, Injectable } from '@angular/core';
import { Logger } from '@obsidize/rx-console';

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandlerService implements ErrorHandler {

  private readonly logger = new Logger(`AppErrorHandlerService`);

  public handleError(error: any): void {
    this.logger.fatal(`*******************************************************************`);
    this.logger.fatal(`----------------------- !!! FATAL !!! -----------------------------`);
    this.logger.fatal(`-------------------------------------------------------------------`);
    this.logger.fatal(`${error}`);
    this.logger.fatal(`${error?.stack}`);
    this.logger.fatal(JSON.stringify(error));
    this.logger.fatal(`===================================================================`);
  }
}
