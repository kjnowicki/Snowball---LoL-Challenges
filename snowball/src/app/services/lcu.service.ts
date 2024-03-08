import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LcuService {
  public port: string | undefined;
  public token: string | undefined;

  @Output() credentials: EventEmitter<{
    port: string | undefined;
    token: string | undefined;
  }> = new EventEmitter();

  constructor() {
    this.updateInfo();
  }

  updateInfo() {
    overwolf.games.launchers.events.getInfo(
      10902,
      (result: overwolf.games.launchers.events.GetInfoResult) => {
        try {
          this.port = result.res.credentials.port;
          this.token = result.res.credentials.token;
          this.credentials.emit({port: this.port, token: this.token})
        } catch (ignored: unknown) {
          if (ignored instanceof TypeError) return;
        }
      }
    );
  }
}
