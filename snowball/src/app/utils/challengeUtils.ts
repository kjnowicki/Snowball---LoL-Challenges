import { Challenge, Threshold } from '../../model/challenge';
import { ChallengesService } from '../services/challenges.service';
import { DataDragonService } from '../services/data-dragon.service';
import { ChampionsUtils } from './championsUtils';

export class ChallengeUtils {
  static getChampionChallenges = () => {
    return ChallengesService.challengesCached
          .filter((ch) => ch.idListType == 'CHAMPION')
          .filter((ch) => ch.retireTimestamp == 0)
          .filter((ch) => !(ch.category == "COLLECTION" && ch.source != "ETERNALS"));
  }

  static getChallengeProgress = (challenge: Challenge) => {
    let currentProgressText = `${challenge.currentValue}`;
    let nextLevelText = ``;

    if (challenge.nextThreshold != 0) {
      let threshold: Threshold | undefined = new Map(
        Object.entries(challenge.thresholds)
      ).get(challenge.nextLevel);
      nextLevelText = `/ ${challenge.nextThreshold}  -  Next: ${challenge.nextLevel}`;
      if (threshold != undefined) {
        nextLevelText += ` (+ ${ChallengeUtils.getNextPointsReward(challenge)} Points)`;
      }
    } else {
      nextLevelText += "- COMPLETED";
    }
    return `${currentProgressText} ${nextLevelText}`;
  };

  static getNextPointsReward = (challenge: Challenge) => {
    let threshold: Threshold | undefined = new Map(
      Object.entries(challenge.thresholds)
    ).get(challenge.nextLevel);
    if (threshold == undefined) return 0;
    return (
      (threshold.rewards.filter((r) => r.category == 'CHALLENGE_POINTS').at(0)
        ?.quantity ?? challenge.pointsAwarded) - challenge.pointsAwarded
    );
  };

  static getAvailableItems(challenge: Challenge): any[] {
    let idType = challenge.idListType;
    switch (idType) {
      case 'CHAMPION': {
        let completed = challenge.completedIds.map(
          (id) => ChampionsUtils.getChampionById(DataDragonService.champions, id)?.name
        );
        let available = challenge.availableIds.map(
          (id) => ChampionsUtils.getChampionById(DataDragonService.champions, id)
        ).filter(champ => champ && !completed?.includes(champ.name));
        if (available?.length == 0) {
          available = DataDragonService.champions
            .filter((ch) => !completed?.includes(ch.name))
        }
        return available ?? [];
      }
    }
    return [];
  }

  static getSubChallenges(challenges: Challenge[],idList: number[]) {
    return challenges.filter((ch) =>
      idList.includes(ch.id)
    );
  }
}

export enum ChallengeType {
  skins,
  mastery,
  masteryLevel
}

interface AdditionalInfo {
  typeName: ChallengeType;
  screens: string[];
}

export const additionalInfo: AdditionalInfo[] = [
  {typeName: ChallengeType.skins, screens: ['Need a Bigger Closet'] },
  {typeName: ChallengeType.mastery, screens:  ["Catch 'em All"] },
  {typeName: ChallengeType.masteryLevel, screens: ["Master Yourself", "Master the Enemy (Legacy)", "Master the Enemy"] },
];
