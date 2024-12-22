import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChallengesService } from '../services/challenges.service';
import { Challenge } from '../../model/challenge';
import { ChampSelectSession } from '../../model/session';
import { Champion } from '../../model/champion';
import { CommonModule } from '@angular/common';
import { DataDragonService } from '../services/data-dragon.service';
import { ChampionsUtils } from '../utils/championsUtils';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SummonerService } from '../services/summoner.service';

@Component({
    selector: 'champ-select',
    imports: [CommonModule, MatTableModule, MatIconModule],
    templateUrl: './champ-select.component.html',
    styleUrl: './champ-select.component.css'
})
export class ChampSelectComponent implements OnChanges {
  championChallenges: Challenge[] = [];
  displayedColumns: string[] = [];
  availableChampions: MatTableDataSource<Champion> = new MatTableDataSource();
  champChallengesMap: Map<Champion, Challenge[]> = new Map();
  champions: Champion[];
  selectedChampion: Champion | undefined;
  chUtils = ChampionsUtils;

  @Input() sessionData: ChampSelectSession | undefined;
  sessionType: string = '';

  constructor(private ddService: DataDragonService) {
    this.champions = ddService.champions;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sessionData == undefined) return;
    this.sessionType = this.sessionData.allowRerolling ? "ARAM" : "CLASSIC";
    this.championChallenges = ChallengesService.challengesCached
      .filter((ch) => ch.idListType == 'CHAMPION')
      .filter((ch) => ch.retireTimestamp == 0)
      .filter((ch) => ch.gameModes.includes(this.sessionType));
    this.displayedColumns = [
      'name',
      'count',
      ...this.championChallenges.map((ch) => ch.name),
    ];

    this.champChallengesMap = new Map();
    this.championChallenges.forEach((challenge) => {
      if (challenge.availableIds.length == 0) {
        challenge.availableIds = this.getReverseCompletion(challenge);
      }
      challenge.availableIds.forEach((champId) => {
        let champ;
        if (
          this.sessionType == 'ARAM' &&
          !this.getSessionChamps().includes(champId)
        )
          return;
        champ = ChampionsUtils.getChampionById(this.champions, champId);
        if (!champ) return;
        if (this.champChallengesMap.has(champ)) {
          this.champChallengesMap.get(champ)?.push(challenge);
        } else {
          this.champChallengesMap.set(champ, [challenge]);
        }
      });
    });
    this.availableChampions.data = this.getChampionsAvailable();
    this.selectedChampion = this.champions.find(
      (champ) =>
        this.sessionData?.myTeam
          .find(
            (team) => team.summonerId == SummonerService.summoner?.summonerId
          )
          ?.championId.toString() == champ.key
    );
  }

  getChampionsAvailable() {
    return Array.from(this.champChallengesMap.keys());
  }

  isChampAvailable(champion: Champion, challName: string): boolean {
    return (
      this.champChallengesMap
        .get(champion)
        ?.some((chall) => chall.name == challName) ?? false
    );
  }

  getSessionChamps(): number[] {
    let champIds: number[] = [];
    this.sessionData?.benchChampions.forEach((benchChamp) => {
      champIds.push(benchChamp.championId);
    });
    this.sessionData?.myTeam.forEach((teammate) =>
      champIds.push(teammate.championId)
    );
    return champIds;
  }

  getReverseCompletion(challenge: Challenge): number[] {
    return this.ddService.champions
      .map((ch) => Number(ch.key))
      .filter((key) => !challenge.completedIds.includes(key));
  }
}
