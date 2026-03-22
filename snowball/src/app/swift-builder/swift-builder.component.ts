import { Component } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from "@angular/forms";
import { Champion } from '../../model/champion';
import { DataDragonService } from '../services/data-dragon.service';
import { MatSelect, MatOption } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { ChallengesService } from '../services/challenges.service';
import { Challenge } from '../../model/challenge';
import { ChallengeUtils } from '../utils/challengeUtils';
import { MatTable, MatTableModule } from "@angular/material/table";

@Component({
  selector: 'app-swift-builder',
  imports: [MatRadioModule, FormsModule, MatSelect, MatOption, MatInput, MatTable, MatTableModule],
  templateUrl: './swift-builder.component.html',
  styleUrl: './swift-builder.component.css'
})
export class SwiftBuilderComponent {
  champBasedBuilder: boolean = true;
  championsSelected: Array<Champion | null> = new Array(5);
  championsToSelect: Array<Champion>;
  searchChampTerm: string[] = new Array(5);
  challengesSelected: Challenge[] = [];
  challengesToSelect: Challenge[] = [];

  challengesSatisfied: Challenge[] = [];
  challengesSatisfiedColumns: string[] = ['name', 'description', 'progress'];

  challUtils = ChallengeUtils;

  constructor(){
    this.championsToSelect = DataDragonService.champions;
    this.challengesToSelect = ChallengeUtils.getChampionChallenges();
  }

  getFilteredChampionsToSelect(index: number) {
    return this.championsToSelect
      .filter(champion => this.searchChampTerm[index] == null || champion.name.includes(this.searchChampTerm[index]))
      .filter(champion => !this.championsSelected.slice(0, index).includes(champion))
      .filter(champion => !this.championsSelected.slice(index + 1).includes(champion))
  }

  getSatisfiedChallenges() {
    return this.challengesToSelect.filter(challenge => {
      let champions: Champion[] = ChallengeUtils.getAvailableItems(challenge);
      let threeOrMore: boolean = challenge.description.includes("3 or more");
      let fiveStack: boolean = challenge.description.includes("5 champions");
      let commonChampions = this.championsSelected.filter(ch => ch && champions.includes(ch));
      if (fiveStack) {
        return commonChampions.length == 5
      } else if (threeOrMore) {
        return commonChampions.length >= 3
      } else if (this.championsSelected[0]) {
        return champions.includes(this.championsSelected[0]);
      }
      return false;
    });
  }

  getPlaceholder(index: number): string {
    return index == 0 ? "Select YOUR champion" : "Select teammate champion";
  }

  challengeType(tableElement: any): Challenge {
    return tableElement;
  }
}
