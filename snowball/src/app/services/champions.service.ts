import { EventEmitter, Injectable, Output } from '@angular/core';
import { LcuService } from './lcu.service';
import { SummonerService } from './summoner.service';
import { LocalChampion } from '../../model/local.champion';
import { ChampionMastery } from '../../model/mastery';
@Injectable({
  providedIn: 'root',
})
export class ChampionsService {
  champions: LocalChampion[] = [];
  championMastery: ChampionMastery[] = [];

  @Output() championsEvent: EventEmitter<LocalChampion[]> = new EventEmitter();
  @Output() championsMasteryEvent: EventEmitter<ChampionMastery[]> = new EventEmitter();

  constructor(
    private lcuService: LcuService,
    private sumSurvice: SummonerService
  ) {
    this.updateChampions();
    this.updateChampionMastery();
    sumSurvice.summonerEvent.subscribe(data => {
      this.updateChampions();
      this.updateChampionMastery();
    });
  }

  public updateChampions() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-champions/v1/inventories/${SummonerService.summoner?.summonerId}/champions`;
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

  public updateChampionMastery() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-collections/v1/inventories/${SummonerService.summoner?.summonerId}/champion-mastery`;
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
          this.championMastery = Array.from(json);
          this.championsMasteryEvent.emit(this.championMastery);
        }
      }
    );
  }
}
