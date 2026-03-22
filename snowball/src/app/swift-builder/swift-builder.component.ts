import { Component } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from "@angular/forms";
import { Champion } from '../../model/champion';
import { DataDragonService } from '../services/data-dragon.service';
import { MatSelect, MatOption } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { ChallengesService } from '../services/challenges.service';
import { Challenge } from '../../model/challenge';

@Component({
  selector: 'app-swift-builder',
  imports: [MatRadioModule, FormsModule, MatSelect, MatOption, MatInput],
  templateUrl: './swift-builder.component.html',
  styleUrl: './swift-builder.component.css'
})
export class SwiftBuilderComponent {
  champBasedBuilder: boolean = true;
  championsSelected: Array<Champion | null> = new Array(5);
  championsToSelect: Array<Champion>;
  searchChampTerm: string[] = new Array(5);
  challengesToSelect: Challenge[] = [];

  constructor(challengesService: ChallengesService){
    this.championsToSelect = DataDragonService.champions;
    challengesService.challenges.subscribe((data) => {
      this.challengesToSelect.push(...data);
    });
  }

  getFilteredChampionsToSelect(index: number) {
    return this.championsToSelect
      .filter(champion => this.searchChampTerm[index] == null || champion.name.includes(this.searchChampTerm[index]))
      .filter(champion => !this.championsSelected.slice(0, index).includes(champion))
      .filter(champion => !this.championsSelected.slice(index + 1).includes(champion))
  }
}
