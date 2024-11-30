import { EventEmitter, Injectable, Output } from '@angular/core';
import { LcuService } from './lcu.service';
import { Summoner } from '../../model/summoner';

@Injectable({
  providedIn: 'root',
})
export class SummonerService {
  static summoner: Summoner | undefined;

  @Output() summonerEvent: EventEmitter<Summoner> = new EventEmitter();

  constructor(private lcuService: LcuService) {
    this.updateSummoner();
    lcuService.credentials.subscribe((data) => {
      this.updateSummoner();
    });
  }

  private updateSummoner() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-summoner/v1/current-summoner`;
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
          SummonerService.summoner = JSON.parse(data.data);
          this.summonerEvent.emit(SummonerService.summoner);
        }
      }
    );
  }
}
