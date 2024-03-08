import { EventEmitter, Injectable, Output } from '@angular/core';
import { LcuService } from './lcu.service';
import { SummonerService } from './summoner.service';
import { LocalChampion } from '../../model/local.champion';
@Injectable({
  providedIn: 'root',
})
export class ChampionsService {
  champions: LocalChampion[] = [];

  @Output() championsEvent: EventEmitter<LocalChampion[]> = new EventEmitter();

  constructor(
    private lcuService: LcuService,
    private sumSurvice: SummonerService
  ) {
    this.updateChampions();
    sumSurvice.summonerEvent.subscribe(data => {
      this.updateChampions();
    });
  }

  public updateChampions() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-champions/v1/inventories/${this.sumSurvice.summoner?.summonerId}/champions`;
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
          this.champions = Array.from(json);
          this.championsEvent.emit(this.champions);
        }
      }
    );
  }
}
