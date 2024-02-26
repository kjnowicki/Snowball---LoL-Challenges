import { CommonModule } from '@angular/common';
import { ApplicationRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Challenge } from '../../model/challenges';

@Component({
  selector: 'challenges-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTableModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './challenges-overview.component.html',
  styleUrl: './challenges-overview.component.css',
})
export class ChallengesOverviewComponent {
  displayedColumns: string[] = ['name', 'category'];
  public _data = new MatTableDataSource<Challenge>();
  public dataLoaded = false;
  private _port!: string;
  private _token!: string;

  constructor(public ref: ApplicationRef) {
    overwolf.games.launchers.events.getInfo(
      10902,
      (result: overwolf.games.launchers.events.GetInfoResult) => {
        this._port = result.res.credentials.port;
        this._token = result.res.credentials.token;
        this.getChallenges();
      }
    );
    this._data.filterPredicate = (challenge, filterValue) => {
      return challenge.name.toLowerCase().includes(filterValue.toLowerCase());
    };
  }

  private getChallenges() {
    const url: string = `https://127.0.0.1:${this._port}/lol-challenges/v1/challenges/local-player`;
    const headers: overwolf.web.FetchHeader[] = [];
    headers.push({ key: 'Accept', value: '*/*' });
    headers.push({ key: 'Accept-Encoding', value: 'gzip, deflate, br' });
    headers.push({ key: 'Authorization', value: 'Basic ' + `${this._token}` });
    overwolf.web.sendHttpRequest(
      url,
      overwolf.web.enums.HttpRequestMethods.GET,
      headers,
      '',
      (data) => {
        if (data.data) {
          let json = JSON.parse(data.data);
          this._data.data = Array.from(
            new Map<string, Challenge>(Object.entries(json)).values()
          );
          this.dataLoaded = true;
        }
      }
    );
  }

  updateFilter(event: Event) {
    this._data.filter = (event.target as HTMLInputElement).value;
  }
}
