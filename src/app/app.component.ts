import { Component } from '@angular/core';
import { Logger } from '@obsidize/rx-console';
import { BootstrapService } from './services/core/bootstrap.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private readonly logger = new Logger(`AppComponent`);

  constructor(
    private readonly bootstrap: BootstrapService
  ) {
    this.bootstrapApp();
  }

  private bootstrapApp(): void {
    this.logger.debug(`bootstrapApp()`);
    this.bootstrap.initialize()
      .then(() => this.logger.debug(`app initialization complete`))
      .catch(e => this.logger.debug(`!!! app initialization error !!! -> `, e));
  }
}
