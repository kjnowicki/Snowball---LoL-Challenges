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
import { MatCheckbox } from "@angular/material/checkbox";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-swift-builder',
  imports: [MatRadioModule, FormsModule, MatSelect, MatOption, MatInput, MatTable, MatTableModule, MatCheckbox, MatTooltip],
  templateUrl: './swift-builder.component.html',
  styleUrl: './swift-builder.component.css'
})
export class SwiftBuilderComponent {
  championsSelected: Array<Champion | null> = new Array(5);
  championsToSelect: Array<Champion>;
  searchChampTerm: string[] = new Array(5);
  challengesSelected: Challenge[] = [];
  challengesToSelect: Challenge[] = [];

  synergyChallengesColumns: string[] = ['name', 'synergy', 'available', 'progress'];
  soloChallengesColumns: string[] = ['name', 'description', 'progress'];
  showSoloChallenges: boolean = true;
  showTeamChallenges: boolean = true;
  showCompletedChallenges: boolean = false;
  showRecommendedChampions: boolean = true;
  championsRecommended: string = "";

  challUtils = ChallengeUtils;

  constructor(){
    this.championsToSelect = DataDragonService.champions;
    this.challengesToSelect = ChallengeUtils.getChampionChallenges();
  }

  getFilteredChampionsToSelect(index: number) {
    return this.championsToSelect
      .filter(champion => this.searchChampTerm[index] == null || champion.name.toLowerCase().includes(this.searchChampTerm[index].toLowerCase()))
      .filter(champion => !this.championsSelected.slice(0, index).includes(champion))
      .filter(champion => !this.championsSelected.slice(index + 1).includes(champion))
  }

  getSynergyChallenges() {
    return this.challengesToSelect.filter(challenge => {
      return this.isChallengeSynergyOfThree(challenge) || this.isChallengeSynergyOfFive(challenge);
    }).filter(ch => this.isChallengeRewardRelevant(ch))
    .sort((a,b) => {
      return this.getSynergyCount(b) / this.getSynergyBase(b) - this.getSynergyCount(a) / this.getSynergyBase(a);
    });
  }

  getSynergyBase(challenge: Challenge) : number {
    return this.isChallengeSynergyOfThree(challenge) ? 3 : 5;
  }

  getSynergyCount(challenge: Challenge) : number {
    let champions: Champion[] = ChallengeUtils.getAvailableItems(challenge);
    return this.championsSelected.filter(ch => ch && champions.includes(ch)).length;
  }

  getSoloSatisfiedChallenges() {
    return this.challengesToSelect.filter(challenge => {
      let champions: Champion[] = ChallengeUtils.getAvailableItems(challenge);
      if (this.isChallengeSynergyOfThree(challenge) || this.isChallengeSynergyOfFive(challenge)) {
        return false;
      }
      else if (this.championsSelected[0]) {
        return champions.includes(this.championsSelected[0]);
      }
      return false;
    })
    .filter(ch => this.isChallengeRewardRelevant(ch))
    .sort((a,b) => a.name.localeCompare(b.name));
  }

  private isChallengeRewardRelevant(ch: Challenge): unknown {
    return this.showCompletedChallenges || ChallengeUtils.getNextPointsReward(ch) > 0;
  }

  isChallengeSynergyOfThree(challenge: Challenge) {
    return challenge.description.includes("3 or more");
  }

  isChallengeSynergyOfFive(challenge: Challenge) {
    return challenge.description.includes("5 champions");
  }

  getPlaceholder(index: number): string {
    return index == 0 ? "Select YOUR champion" : "Select teammate champion";
  }

  challengeType(tableElement: any): Challenge {
    return tableElement;
  }

  getAvailableChampionsList(challenge: Challenge) {
    return ChallengeUtils.getAvailableItems(challenge);
  }

  getUnselectedAvailableChampionsList(challenge: Challenge) {
    return this.getAvailableChampionsList(challenge)
      .filter(champ => !this.championsSelected.includes(champ));
  }

  getUnselectedAvailableChampionsListNames(challenge: Challenge) {
    return this.getUnselectedAvailableChampionsList(challenge)
      .map(champ => champ.name)
      .sort()
      .join(", ");
  }

  championsSelectedChanged(index: number) {
    this.searchChampTerm[index] = "";
    this.championsRecommended = this.getRecommendedChampions();
  }

  getRecommendedChampions() {
    let championsRecommendationScore = new Map(this.championsToSelect.filter(champ => !this.championsSelected.includes(champ)).map(champ => [champ, 0]));
    this.getSynergyChallenges()
      .map(chall => {
        let synergyPower = this.getAvailableChampionsList(chall).filter(ch => this.championsSelected.includes(ch)).length;
        let synergyRequired = this.isChallengeSynergyOfThree(chall) ? 3 : 5;
        let synergyPoints = synergyRequired > synergyPower ? synergyPower : 0;
        return {
          champions: this.getUnselectedAvailableChampionsList(chall),
          synergyPoints: synergyPoints,
          synergyRequired: synergyRequired
        };
      })
      .forEach(synergyDetails => {
        synergyDetails.champions.forEach(champ => {
          let currentScore = championsRecommendationScore.get(champ) ?? 0;
          championsRecommendationScore.set(champ, currentScore + (synergyDetails.synergyPoints * 2 + 1)  / synergyDetails.synergyRequired);
        })    
      });
      console.log(championsRecommendationScore);
    return this.championsToSelect.slice().sort((champA, champB) => {
      return (championsRecommendationScore.get(champB) ?? 0) - (championsRecommendationScore.get(champA) ?? 0);
    }).slice(0, 5).map(ch => ch.name).join(", ");
  }
}