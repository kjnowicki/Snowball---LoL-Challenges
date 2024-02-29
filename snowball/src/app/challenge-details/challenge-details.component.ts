import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Challenge } from '../../model/challenge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Champion, Champions } from '../../model/champion';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'challenge-details',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    HttpClientModule,
  ],
  templateUrl: './challenge-details.component.html',
  styleUrl: './challenge-details.component.css',
})
export class ChallengeDetailsComponent {
  @Input() challenge: Challenge | undefined;
  @Output() close = new EventEmitter();

  champions: Champion[] = [];

  constructor(private http: HttpClient) {
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
          available = this.champions.filter((ch) => !completed?.includes(ch.name)).map((ch) => ch.name);
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
        return this.challenge?.completedIds.map(
          (id) => this.getChampionById(id.toString())?.name
        ) ?? [];
      }
    }
    return [];
  }

  getChampionById(id: string) {
    return this.champions.find((champion) => champion.key == id);
  }
}
