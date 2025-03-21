import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
import { ChampionsUtils } from '../utils/championsUtils';
import { additionalInfo } from '../utils/challengeUtils';
import { ChampionsService } from '../services/champions.service';
import { DataDragonService } from '../services/data-dragon.service';

@Component({
    selector: 'challenge-details',
    imports: [
        MatIconModule,
        MatButtonModule,
        CommonModule,
        MatDividerModule,
        MatListModule,
    ],
    templateUrl: './challenge-details.component.html',
    styleUrl: './challenge-details.component.css'
})
export class ChallengeDetailsComponent implements AfterViewInit {
  @Input() challenge: Challenge | undefined;
  @Output() close = new EventEmitter();
  @Input() isSubchallenge: boolean = false;

  @Output() subChallengeChosenEvent = new EventEmitter<Challenge>();

  chUtils = ChallengeUtils;
  champUtils = ChampionsUtils;
  specificInfo = additionalInfo;

  skinsCounts: { count: number; names: string[] }[] = [];
  championsUnderMastery: Champion[] = [];

  constructor(
    private http: HttpClient,
    private chService: ChallengesService,
    private frService: FriendsService,
    public champsService: ChampionsService,
    private ddService: DataDragonService
  ) {
    chService.challenges.subscribe((data) => {
      this.challenge = data
        .filter((dataCh) => dataCh.id == this.challenge?.id)
        .at(0);
      this.initSpecficData();
    });
  }

  ngAfterViewInit(): void {
    this.initSpecficData();
  }

  private initSpecficData() {
    switch (this.challenge?.name) {
      case additionalInfo.skins: {
        this.skinsCounts = ChampionsUtils.getSkinsCount(
          this.champsService.champions
        );
        this.champsService.championsEvent.subscribe((data) => {
          this.skinsCounts = ChampionsUtils.getSkinsCount(data);
        });
        break;
      }
      case additionalInfo.mastery: {
        this.championsUnderMastery =
          ChampionsUtils.getChampionsBelowMasteryThreshold(
            this.champsService.championMastery,
            this.challenge.nextThreshold,
            this.ddService.champions
          );
        this.champsService.championsMasteryEvent.subscribe((data) => {
          this.championsUnderMastery =
            ChampionsUtils.getChampionsBelowMasteryThreshold(
              data,
              this.challenge?.nextThreshold ?? 0,
              this.ddService.champions
            );
        });
        break;
      }
    }
  }

  getFriend(friendId: string): Friend | undefined {
    return this.frService.friendsCached.find((fr) => fr.puuid == friendId);
  }

  getFriends(friendsLevel: FriendsLevels): string {
    return friendsLevel.friends
      .map((frId) => this.getFriend(frId)?.gameName)
      .join(', ');
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
          available = this.ddService.champions
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
    return this.ddService.champions.find((champion) => champion.key == id);
  }

  getSubChallenges(idList: number[]) {
    return ChallengesService.challengesCached.filter((ch) =>
      idList.includes(ch.id)
    );
  }

  chooseParentChallenge() {
    this.challenge = ChallengesService.challengesCached
      .filter((ch) => ch.id == this.challenge?.parentId)
      .at(0);
  }

  subChallengeChosen($event: Challenge) {
    this.challenge = $event;
  }
}
