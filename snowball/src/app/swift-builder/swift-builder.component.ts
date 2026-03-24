import { Component } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from "@angular/forms";
import { Champion } from '../../model/champion';
import { DataDragonService } from '../services/data-dragon.service';
import { MatSelect, MatOption } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { Challenge } from '../../model/challenge';
import { ChallengeUtils } from '../utils/challengeUtils';
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatTooltip } from "@angular/material/tooltip";
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-swift-builder',
  imports: [MatRadioModule, FormsModule, MatSelect, MatOption, MatInput, MatTable, MatTableModule, MatCheckbox, MatTooltip, MatIconModule],
  templateUrl: './swift-builder.component.html',
  styleUrl: './swift-builder.component.css'
})
export class SwiftBuilderComponent {
  championsSelected: Array<Champion | null> = new Array(5);
  championsToSelect: Array<Champion>;
  searchChampTerm: string[] = new Array(5);
  challengesSelected: Challenge[] = [];
  challengesToSelect: Challenge[] = [];

  synergyChallengesColumns: string[] = ['mandatory', 'name', 'synergy', 'available', 'progress'];
  soloChallengesColumns: string[] = ['mandatory-solo', 'name', 'description', 'progress'];
  showSoloChallenges: boolean = true;
  showTeamChallenges: boolean = true;
  showCompletedChallenges: boolean = false;
  showRecommendedChampions: boolean = true;
  championsRecommended: string = "";
  soloChampionsRecommended: string = "";

  mandatorySelection = new SelectionModel<Challenge>(true, []);
  mandatorySoloSelection = new SelectionModel<Challenge>(true, []);

  challUtils = ChallengeUtils;

  constructor(){
    this.championsToSelect = DataDragonService.champions;
    this.challengesToSelect = ChallengeUtils.getChampionChallenges().filter(chall => !chall.gameModes.includes("CHERRY"));
    this.championsRecommended = this.getRecommendedChampions();
    this.soloChampionsRecommended = this.getSoloRecommendedChampions();
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

  getSoloChallenges() {
    return this.challengesToSelect.filter(challenge => {
      return !(this.isChallengeSynergyOfThree(challenge) || this.isChallengeSynergyOfFive(challenge));
    })
    .filter(ch => this.isChallengeRewardRelevant(ch))
    .sort((a,b) => {
      let bMet = this.isSoloChallengeSatisfied(b) ? 1 : 0;
      let aMet = this.isSoloChallengeSatisfied(a) ? 1 : 0;
      let dif = bMet - aMet;
      return dif != 0 ? dif : a.name.localeCompare(b.name);
    });
  }

  isSoloChallengeSatisfied(challenge: Challenge) {
      let champions: Champion[] = ChallengeUtils.getAvailableItems(challenge);
      if (this.championsSelected[0]) {
        return champions.includes(this.championsSelected[0]);
      }
      return false;
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

  getSelectedAvailableChampionsListNames(challenge: Challenge) {
    return this.getAvailableChampionsList(challenge)
      .filter(champ => this.championsSelected.includes(champ))
      .map(champ => champ.name)
      .sort()
      .join(", ");
  }

  mandatorySelected(challenge: Challenge) {
    this.mandatorySelection.toggle(challenge);
    this.championsRecommended = this.getRecommendedChampions();
  }

  mandatorySoloSelected(challenge: Challenge) {
    this.mandatorySoloSelection.toggle(challenge);
    this.soloChampionsRecommended = this.getSoloRecommendedChampions();
  }

  championsSelectedChanged(index: number) {
    this.searchChampTerm[index] = "";
    this.championsRecommended = this.getRecommendedChampions();
    this.soloChampionsRecommended = this.getSoloRecommendedChampions();
  }

  getSoloRecommendedChampions() {
    let championsRecommendationScore = new Map(this.championsToSelect.filter(champ => !this.championsSelected.includes(champ)).map(champ => [champ, 0]));
    this.getSoloChallenges()
      .forEach(chall => {
        this.getAvailableChampionsList(chall).forEach(champ => {
          let currentScore = championsRecommendationScore.get(champ) ?? 0;
          let mandatoryMultiplier = this.mandatorySoloSelection.isSelected(chall) ? 100 : 1;
          championsRecommendationScore.set(champ, currentScore + 1 * mandatoryMultiplier);
        })
      });
    return this.championsToSelect.slice().sort((champA, champB) => {
      return (championsRecommendationScore.get(champB) ?? 0) - (championsRecommendationScore.get(champA) ?? 0);
    }).slice(0, 5).map(ch => ch.name).join(", ");
  }

  getRecommendedChampions() {
    let championsRecommendationScore = new Map(this.championsToSelect.filter(champ => !this.championsSelected.includes(champ)).map(champ => [champ, 0]));
    this.getSynergyChallenges()
      .forEach(chall => {
        let synergyPower = this.getAvailableChampionsList(chall).filter(ch => this.championsSelected.includes(ch)).length;
        let synergyRequired = this.isChallengeSynergyOfThree(chall) ? 3 : 5;
        let synergyPoints = synergyRequired > synergyPower ? (synergyPower + 1) * 10 / synergyRequired + 1 : 0;
        let mandatoryMultiplier = this.mandatorySelection.isSelected(chall) ? 100 : 1;

        this.getUnselectedAvailableChampionsList(chall).forEach(champ => {
          let currentScore = championsRecommendationScore.get(champ) ?? 0;
          let newScore = currentScore + synergyPoints * mandatoryMultiplier;
          championsRecommendationScore.set(champ, newScore);
        })
      });
    return this.championsToSelect.slice().sort((champA, champB) => {
      return (championsRecommendationScore.get(champB) ?? 0) - (championsRecommendationScore.get(champA) ?? 0);
    }).slice(0, 5).map(ch => ch.name).join(", ");
  }
  
  resetSelected() {
    this.championsSelected = new Array(5);
  }
}