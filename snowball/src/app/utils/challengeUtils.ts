import { Challenge, Threshold } from '../../model/challenge';

export class ChallengeUtils {
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
