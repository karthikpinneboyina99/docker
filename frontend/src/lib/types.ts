export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface Club {
  id: string;
  name: string;
  league: string;
  country: string;
  clubLogoUrl?: string | null;
  bannerImageUrl?: string | null;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  currentClubId: string;
  contractExpiry: string;
  marketValue: number;
  estimatedWage: number | null;
  imageUrl?: string | null;
  bannerImageUrl?: string | null;
  currentClub?: Club;
  rumors?: Rumor[];
  topRumor?: Rumor | null;
}

export interface Source {
  id: string;
  name: string;
  outlet?: string | null;
  reliabilityWeight: number;
}

export interface RumorSource {
  id: string;
  sourceId: string;
  reportedAt: string;
  source: Source;
}

export interface Rumor {
  id: string;
  playerId: string;
  fromClubId: string;
  toClubId: string;
  status: 'RUMOR' | 'ADVANCED_TALKS' | 'AGREED' | 'COMPLETED' | 'DENIED' | 'DEAD';
  reportedFee: number | null;
  reportedSummary?: string | null;
  createdAt: string;
  updatedAt: string;
  player?: Player;
  fromClub?: Club;
  toClub?: Club;
  reports?: RumorSource[];
  reliabilityScore?: number;
  transferProbability?: number;
}

export interface SpendingRecord {
  window: string;
  totalSpend: number;
}

export interface WageEstimate {
  estimatedWage: number;
  explanation: string;
}

export interface RumorSummary {
  summary: string;
  generatedBy: 'ai' | 'fallback';
}

export interface TransferRecord {
  id: string;
  playerId: string;
  fromClubId: string;
  toClubId: string;
  fee: number;
  date: string;
  window: string;
  player?: Player;
  fromClub?: Club;
  toClub?: Club;
}
