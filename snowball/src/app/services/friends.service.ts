import { EventEmitter, Injectable, Output } from '@angular/core';
import { Friend } from '../../model/friend';
import { LcuService } from './lcu.service';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  friendsCached: Array<Friend> = [];

  @Output() friends: EventEmitter<Friend[]> = new EventEmitter();

  constructor(private lcuService: LcuService) {
    this.updateFriends();
    lcuService.credentials.subscribe((credentials) => {
      this.updateFriends();
    });
  }

  updateFriends() {
    let url: string = `https://127.0.0.1:${this.lcuService.port}/lol-chat/v1/friends`;
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
          this.friendsCached = Array.from(json);
          this.friends.emit(this.friendsCached);
        }
      }
    );
  }
}
