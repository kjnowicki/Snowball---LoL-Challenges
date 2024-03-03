import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Challenge, FriendsLevels } from '../../model/challenge';
import { Champion, Champions } from '../../model/champion';
import { ChallengesService } from '../services/challenges.service';
import { ChallengeUtils } from '../utils/challengeUtils';
import { FriendsService } from '../services/friends.service';
import { Friend } from '../../model/friend';

@Component({
  selector: 'challenge-details',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    HttpClientModule,
    MatListModule
  ],
  templateUrl: './challenge-details.component.html',
  styleUrl: './challenge-details.component.css',
})
export class ChallengeDetailsComponent {
  @Input() challenge: Challenge | undefined;
  @Output() close = new EventEmitter();
  @Input() isSubchallenge: boolean = false;

  @Output() subChallengeChosenEvent = new EventEmitter<Challenge>();

  chUtils = ChallengeUtils;

  champions: Champion[] = [];

  constructor(private http: HttpClient, private chService: ChallengesService, private frService: FriendsService) {
    this.readChampionsFromJSON();
  }

  private readChampionsFromJSON() {
    this.http.get<Champions>('data/champion.json').subscribe((data) => {
      if (data) {
        this.champions = Array.from(
          new Map<string, Champion>(Object.entries(data.data)).values()
        );
      }
    });
  }

  getFriend(friendId: string): Friend | undefined {
    return this.frService.friendsCached.find(fr => fr.puuid == friendId);
  }

  getFriends(friendsLevel: FriendsLevels): string {
    return friendsLevel.friends.map(frId => this.getFriend(frId)?.gameName).join(", ");
  }

  getAvailableItems(): any[] {
    let idType = this.challenge?.idListType;
    switch (idType) {
      case 'CHAMPION': {
        let available = this.challenge?.availableIds.map(
          (id) => this.getChampionById(id.toString())?.name
        );
        let completed = this.challenge?.completedIds.map(
          (id) => this.getChampionById(id.toString())?.name
        );
        if (available?.length == 0) {
          available = this.champions
            .filter((ch) => !completed?.includes(ch.name))
            .map((ch) => ch.name);
        }
        return available ?? [];
      }
    }
    return [];
  }

  getCompletedItems(): any[] {
    let idType = this.challenge?.idListType;
    switch (idType) {
      case 'CHAMPION': {
        return (
          this.challenge?.completedIds.map(
            (id) => this.getChampionById(id.toString())?.name
          ) ?? []
        );
      }
    }
    return [];
  }

  getChampionById(id: string) {
    return this.champions.find((champion) => champion.key == id);
  }

  getSubChallenges(idList: number[]) {
    return this.chService.challengesCached.filter((ch) =>
      idList.includes(ch.id)
    );
  }

  chooseParentChallenge() {
    this.challenge = this.chService.challengesCached
      .filter((ch) => ch.id == this.challenge?.parentId)
      .at(0);
  }

  subChallengeChosen($event: Challenge) {
    this.challenge = $event;
  }
}
