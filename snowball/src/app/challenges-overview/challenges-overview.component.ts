import { Component, OnInit } from '@angular/core';
import { Challenge } from '../../model/challenges';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'challenges-overview',
  standalone: true,
  imports: [CommonModule, MatCommonModule, MatInput, MatFormFieldModule],
  templateUrl: './challenges-overview.component.html',
  styleUrl: './challenges-overview.component.css'
})
export class ChallengesOverviewComponent implements OnInit {
  public _data: Map<string, Challenge> = new Map();
  private _port!: string;
  private _token!: string;

  ngOnInit(): void {
  }

  constructor() {
    overwolf.games.launchers.events.getInfo(10902, (result: overwolf.games.launchers.events.GetInfoResult) => {
      this._port = result.res.credentials.port;
      this._token = result.res.credentials.token;
      this.getChallenges();
    });
  }

  private getChallenges() {
    const url: string = `https://127.0.0.1:${this._port}/lol-challenges/v1/challenges/local-player`;
    const headers: overwolf.web.FetchHeader[] = [];
    headers.push({ key: "Accept", value: "*/*" });
    headers.push({ key: "Accept-Encoding", value: 'gzip, deflate, br' });
    headers.push({ key: "Authorization", value: "Basic " + `${this._token}` });
    overwolf.web.sendHttpRequest(url, overwolf.web.enums.HttpRequestMethods.GET, headers, "", (data) => {
      if (data.data) {
        let json = JSON.parse(data.data);
        this._data = new Map<string, Challenge>(Object.entries(json));
      }
    });
  }
}
