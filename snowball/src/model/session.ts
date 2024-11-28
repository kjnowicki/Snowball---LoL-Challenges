export interface Ban {
	myTeamBans: any[];
	numBans: number;
	theirTeamBans: any[];
}

export interface BenchChampion {
	championId: number;
	isPriority: boolean;
}

export interface MucJwtDto {
	channelClaim: string;
	domain: string;
	jwt: string;
	targetRegion: string;
}

export interface ChatDetail {
	mucJwtDto: MucJwtDto;
	multiUserChatId: string;
	multiUserChatPassword: string;
}

export interface MyTeam {
	assignedPosition: string;
	cellId: number;
	championId: number;
	championPickIntent: number;
	nameVisibilityType: string;
	obfuscatedPuuid: string;
	obfuscatedSummonerId: number;
	puuid: string;
	selectedSkinId: number;
	spell1Id: number;
	spell2Id: number;
	summonerId: number;
	team: number;
	wardSkinId: number;
}

export interface TheirTeam {
	assignedPosition: string;
	cellId: number;
	championId: number;
	championPickIntent: number;
	nameVisibilityType: string;
	obfuscatedPuuid: string;
	obfuscatedSummonerId: number;
	puuid: string;
	selectedSkinId: number;
	spell1Id: number;
	spell2Id: number;
	summonerId: number;
	team: number;
	wardSkinId: number;
}

export interface Timer {
	adjustedTimeLeftInPhase: number;
	internalNowInEpochMs: number;
	isInfinite: boolean;
	phase: string;
	totalTimeInPhase: number;
}

export interface Trade {
	cellId: number;
	id: number;
	state: string;
}

export interface ChampSelectSession {
	actions: any[];
	allowBattleBoost: boolean;
	allowDuplicatePicks: boolean;
	allowLockedEvents: boolean;
	allowRerolling: boolean;
	allowSkinSelection: boolean;
	bans: Ban;
	benchChampions: BenchChampion[];
	benchEnabled: boolean;
	boostableSkinCount: number;
	chatDetails: ChatDetail;
	counter: number;
	gameId: number;
	hasSimultaneousBans: boolean;
	hasSimultaneousPicks: boolean;
	isCustomGame: boolean;
	isSpectating: boolean;
	localPlayerCellId: number;
	lockedEventIndex: number;
	myTeam: MyTeam[];
	pickOrderSwaps: any[];
	recoveryCounter: number;
	rerollsRemaining: number;
	skipChampionSelect: boolean;
	theirTeam: TheirTeam[];
	timer: Timer;
	trades: Trade[];
}