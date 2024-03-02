export interface Challenge {
    availableIds: number[];
    capstoneGroupId: number;
    capstoneGroupName: string;
    category: string;
    childrenIds: number[];
    completedIds: number[];
    currentLevel: string;
    currentLevelAchievedTime: BigInteger;
    currentThreshold: number;
    currentValue: number;
    description: string;
    descriptionShort: string;
    friendsAtLevels: FriendsLevels[];
    gameModes: [],
    hasLeaderboard: boolean;
    iconPath: string;
    id: number,
    idListType: string,
    isApex: boolean;
    isCapstone: boolean;
    isReverseDirection: boolean;
    levelToIconPath: Map<string, string>;
    name: string;
    nextLevel: string;
    nextLevelIconPath: string;
    nextThreshold: number;
    parentId: number;
    parentName: string;
    percentile: number;
    playersInLevel: number;
    pointsAwarded: number;
    position: number;
    previousLevel: string;
    previousValue: number;
    priority: number;
    retireTimestamp: number;
    source: string;
    thresholds: Map<string, Threshold>;
    valueMapping: string;
}

export interface FriendsLevels {
    friends: string[];
    level: string;
}

export interface Threshold {
    rewards: Reward[];
    value: number;
}

export interface Reward {
    asset: string;
    category: string;
    name: string;
    quantity: number;
}