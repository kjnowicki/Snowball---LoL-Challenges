import { Challenge, Threshold } from '../../model/challenge';

export class ChallengeUtils {
  static getChallengeProgress = (challenge: Challenge) => {
    if (challenge.nextThreshold == 0)
      return `${challenge.currentValue} / ${challenge.currentThreshold}`;
    else {
      let threshold: Threshold | undefined = new Map(
        Object.entries(challenge.thresholds)
      ).get(challenge.nextLevel);
      if (threshold != undefined) {
        return `${challenge.currentValue} / ${
          challenge.nextThreshold
        } (+ ${ChallengeUtils.getNextPointsReward(challenge)} Points)`;
      } else {
        return `${challenge.currentValue} / ${challenge.nextThreshold}`;
      }
    }
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

export const additionalInfo: AdditionalInfo = {
  skins: 'Need a Bigger Closet',
  mastery: "Catch 'em All",
};

interface AdditionalInfo {
  skins: string;
  mastery: string;
}
