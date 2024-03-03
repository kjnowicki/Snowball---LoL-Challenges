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
        return `${challenge.currentValue} / ${challenge.nextThreshold} (+ ${
          threshold.rewards
            .filter((r) => r.category == 'CHALLENGE_POINTS')
            .at(0)?.quantity
        } Points)`;
      } else {
        return `${challenge.currentValue} / ${challenge.nextThreshold}`;
      }
    }
  };
}