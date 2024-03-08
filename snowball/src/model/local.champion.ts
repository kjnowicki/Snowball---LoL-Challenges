export interface LocalChampion {
  active: boolean;
  alias: string;
  banVoPath: string;
  baseLoadScreenPath: string;
  baseSplashPath: string;
  botEnabled: boolean;
  chooseVoPath: string;
  disabledQueues: any[];
  freeToPlay: boolean;
  id: number;
  name: string;
  ownership: Ownership;
  passive: Passive;
  purchased: number;
  rankedPlayEnabled: boolean;
  roles: any[];
  skins: Skin[];
  spells: any[];
  squarePortraitPath: string;
  stingerSfxPath: string;
  tacticalInfo: TacticalInfo;
  title: string;
}

interface TacticalInfo {
  damageType: string;
  difficulty: number;
  style: number;
}

interface Passive {
  description: string;
  name: string;
}

interface Ownership {
  loyaltyReward: boolean;
  owned: boolean;
  rental: Rental;
  xboxGPReward: boolean;
}

interface Rental {
  endDate: number;
  purchaseDate: number;
  rented: boolean;
  winCountRemaining: number;
}

interface Skin {
  championId: number;
  chromaPath?: any;
  chromas: any[];
  collectionSplashVideoPath?: any;
  disabled: boolean;
  emblems: any[];
  featuresText?: any;
  id: number;
  isBase: boolean;
  lastSelected: boolean;
  loadScreenPath: string;
  name: string;
  ownership: Ownership;
  questSkinInfo: QuestSkinInfo;
  rarityGemPath: string;
  skinType: string;
  splashPath: string;
  splashVideoPath?: any;
  stillObtainable: boolean;
  tilePath: string;
  uncenteredSplashPath: string;
}

interface QuestSkinInfo {
  collectionCardPath: string;
  collectionDescription: string;
  descriptionInfo: any[];
  name: string;
  productType?: any;
  splashPath: string;
  tiers: any[];
  tilePath: string;
  uncenteredSplashPath: string;
}

interface Ownership {
  loyaltyReward: boolean;
  owned: boolean;
  rental: Rental;
  xboxGPReward: boolean;
}

interface Rental {
  endDate: number;
  purchaseDate: number;
  rented: boolean;
  winCountRemaining: number;
}