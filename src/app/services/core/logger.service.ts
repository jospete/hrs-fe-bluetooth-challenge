import { Injectable } from '@angular/core';
import { Logger, getPrimaryLoggerTransport } from '@obsidize/rx-console';

getPrimaryLoggerTransport().enableDefaultBroadcast();

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private readonly logger = new Logger(`LoggerService`);

  constructor() { }

  public async initialize(): Promise<void> {
    this.logger.debug(`TODO: initialize file system logging if needed`);
  }
}
