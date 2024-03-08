import { Champion } from '../../model/champion';
import { LocalChampion } from '../../model/local.champion';
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
}
