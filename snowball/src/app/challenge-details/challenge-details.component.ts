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
import { Champion } from '../../model/champion';
import { ChallengesService } from '../services/challenges.service';
import { ChallengeType, ChallengeUtils } from '../utils/challengeUtils';
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
  challengeType = ChallengeType;

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
    switch (this.getAdditionalInfoType(this.challenge?.name)) {
      case ChallengeType.skins: {
        this.skinsCounts = ChampionsUtils.getSkinsCount(
          ChampionsService.champions
        );
        this.champsService.championsEvent.subscribe((data) => {
          this.skinsCounts = ChampionsUtils.getSkinsCount(data);
        });
        break;
      }
      case ChallengeType.mastery: {
        this.championsUnderMastery =
          ChampionsUtils.getChampionsBelowMasteryThreshold(
            this.champsService.championMastery,
            this.challenge?.nextThreshold ?? 0,
            DataDragonService.champions
          );
        this.champsService.championsMasteryEvent.subscribe((data) => {
          this.championsUnderMastery =
            ChampionsUtils.getChampionsBelowMasteryThreshold(
              data,
              this.challenge?.nextThreshold ?? 0,
              DataDragonService.champions
            );
        });
        break;
      }
      default:{}
    }
  }

  getAdditionalInfoType(challengeName: string | undefined) {
    return challengeName ? additionalInfo.find(info => info.screens.includes(challengeName))?.typeName : null;
  }

  getChampionMasteryTextList() {
    this.initSpecficData();
    return this.champUtils.champsNamesAndMasteryPoints(this.champsService.championMastery, this.championsUnderMastery);
  }

  getChampionMasteryLevelTextList() {
    return this.champUtils.champsNamesAndMasteryLevel(this.champsService.championMastery, this.getAvailableItems());
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
    return this.challenge == undefined ? [] : ChallengeUtils.getAvailableItems(this.challenge);
  }

  getAvailableNames(): any[] {
    let idType = this.challenge?.idListType;
    switch (idType) {
      case 'CHAMPION': {
        let champions: Champion[] = this.getAvailableItems();
        return champions.map(ch => ch.name)
      }
    }
    return this.getAvailableItems();
  }

  getCompletedNames(): any[] {
    let idType = this.challenge?.idListType;
    switch (idType) {
      case 'CHAMPION': {
        return (
          this.challenge?.completedIds.map(
            (id) => this.getChampionById(id)?.name
          ) ?? []
        );
      }
    }
    return [];
  }

  getChampionById(id: number) {
    return ChampionsUtils.getChampionById(DataDragonService.champions, id);
  }

  getSubChallenges(idList: number[]) {
    return ChallengeUtils.getSubChallenges(ChallengesService.challengesCached, idList);
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
