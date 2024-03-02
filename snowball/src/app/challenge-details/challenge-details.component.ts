import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Challenge } from '../../model/challenge';
import { Champion, Champions } from '../../model/champion';
import { ChallengesService } from '../services/challenges.service';
import { ChallengeUtils } from '../utils/challengeUtils';

@Component({
  selector: 'challenge-details',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    HttpClientModule,
    MatGridListModule,
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

  constructor(private http: HttpClient, private chService: ChallengesService) {
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
