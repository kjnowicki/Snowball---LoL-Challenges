import { EventEmitter, Injectable, Output } from '@angular/core';
import { Challenge } from '../../model/challenge';
import { LcuService } from './lcu.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  challengesCached: Challenge[] = [];

  @Output() challenges: EventEmitter<Challenge[]> = new EventEmitter<Challenge[]>();

  constructor(private lcuService: LcuService) {
    lcuService.credentials.subscribe(credentials => {
      this.updateChallenges();
    });
  }

  updateChallenges() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-challenges/v1/challenges/local-player`;
    const headers: overwolf.web.FetchHeader[] = [];
    headers.push({ key: 'Accept', value: '*/*' });
    headers.push({ key: 'Accept-Encoding', value: 'gzip, deflate, br' });
    headers.push({ key: 'Authorization', value: 'Basic ' + `${this.lcuService.token}` });
    overwolf.web.sendHttpRequest(
      url,
      overwolf.web.enums.HttpRequestMethods.GET,
      headers,
      '',
      (data) => {
        if (data.data) {
          let json = JSON.parse(data.data);
          this.challengesCached = Array.from(
            new Map<string, Challenge>(Object.entries(json)).values()
          );
          this.challenges.emit(this.challengesCached);
        }
      }
    );
  }
}
