import { EventEmitter, Injectable } from '@angular/core';
import { ChampSelectSession } from '../../model/session';
import { LcuService } from './lcu.service';

@Injectable({
  providedIn: 'root',
})
export class ChampSelectService {
  session: ChampSelectSession | undefined = undefined;
  champSelectSession: EventEmitter<ChampSelectSession> =
    new EventEmitter<ChampSelectSession>();

  constructor(private lcuService: LcuService) {
    lcuService.credentials.subscribe((credentials) => {
      this.getSessionIfPresent();
    });
  }

  getSessionIfPresent() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-champ-select/v1/session`;
    const headers: overwolf.web.FetchHeader[] = [];
    headers.push({ key: 'Accept', value: '*/*' });
    headers.push({ key: 'Accept-Encoding', value: 'gzip, deflate, br' });
    headers.push({
      key: 'Authorization',
      value: 'Basic ' + `${this.lcuService.token}`,
    });
    overwolf.web.sendHttpRequest(
      url,
      overwolf.web.enums.HttpRequestMethods.GET,
      headers,
      '',
      (data) => {
        if (data.data) {
          let json = JSON.parse(data.data);
          if (!json.actions && this.session != undefined) {
            this.session = undefined;
            this.champSelectSession.emit(this.session);
          } else {
            this.session = json;
            this.champSelectSession.emit(this.session);
          }
        } else if (this.session != undefined) {
          this.session = undefined;
          this.champSelectSession.emit(this.session);
        }
      }
    );
  }
}
