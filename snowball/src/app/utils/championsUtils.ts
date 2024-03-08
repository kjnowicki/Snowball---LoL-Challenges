import { Champion } from '../../model/champion';
import { LocalChampion } from '../../model/local.champion';
import { ChampionMastery } from '../../model/mastery';
import { LcuService } from '../services/lcu.service';

export class ChampionsUtils {
  constructor() {}

  public static getSkinsCount(champions: LocalChampion[]) {
    if (champions == undefined) return [];
    let nameToCount = champions.slice(1).map((ch) => {
      return {
        name: ch.name,
        count: ch.skins.filter((skin) => skin.ownership.owned).length - 1,
      };
    });
    let skinCounts = new Set(nameToCount.map((ntc) => ntc.count));
    return Array.from(skinCounts)
      .map((count) => {
        return {
          count: count,
          names: nameToCount
            .filter((m) => m.count == count)
            .map((ntc) => ntc.name)
            .sort(),
        };
      })
      .sort((a, b) => (a.count < b.count ? 1 : -1));
  }

  public static getChampionsBelowMasteryThreshold(
    championMastery: ChampionMastery[],
    limit: number,
    champions: Champion[]
  ) {
    return championMastery
      .filter((m) => m.championPoints < limit)
      .map((m) => {
        return champions.find((ch) => ch.key == m.championId.toString());
      })
      .filter(m => m != undefined) as Champion[];
  }

  public static champsNames(champions: Champion[]) {
    return champions.map(ch => ch.name);
  }
}
