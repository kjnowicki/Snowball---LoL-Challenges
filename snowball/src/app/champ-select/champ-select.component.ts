import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChallengesService } from '../services/challenges.service';
import { Challenge } from '../../model/challenge';
import { ChampSelectSession } from '../../model/session';
import { ChampSelectService } from '../services/champ.select.service';
import { Champion } from '../../model/champion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'champ-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './champ-select.component.html',
  styleUrl: './champ-select.component.css',
})
export class ChampSelectComponent implements OnChanges {
  championChallenges: Challenge[] = [];
  champChallengesMap: Map<number, Challenge[]> = new Map();

  @Input() sessionData: ChampSelectSession | undefined;
  sessionType: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.sessionData == undefined) return;
    this.sessionType = this.sessionData.allowRerolling ? "ARAM" : "CLASSIC";
    this.championChallenges = ChallengesService.challengesCached
      .filter((ch) => ch.idListType == 'CHAMPION')
      .filter((ch) => ch.gameModes.includes(this.sessionType));
    this.champChallengesMap = new Map();
    if(this.sessionType == "ARAM") {

    }
    this.championChallenges.forEach((challenge) => {
      challenge.availableIds.forEach((champId) => {
        if (this.champChallengesMap.has(champId)) {
          this.champChallengesMap.get(champId)?.push(challenge);
        } else {
          this.champChallengesMap.set(champId, [challenge]);
        }
      });
    });
  }
}
