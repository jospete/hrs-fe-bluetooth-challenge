import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { Logger } from '@obsidize/rx-console';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {

  private readonly logger = new Logger(`BootstrapService`);

  constructor(
    private readonly loggerService: LoggerService
  ) { }

  public async initialize(): Promise<void> {
    this.logger.debug(`initialize()`);
    await this.loggerService.initialize();
  }
}
