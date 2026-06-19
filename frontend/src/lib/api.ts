import { 
  ApiResponse, 
  Player, 
  Club, 
  Rumor, 
  SpendingRecord, 
  WageEstimate, 
  RumorSummary,
  TransferRecord
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // for Next.js SSR cache revalidation, can be configured later
      cache: 'no-store'
    });
    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export const api = {
  // Players
  getPlayers: (params?: { position?: string; club?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.position) searchParams.append('position', params.position);
    if (params?.club) searchParams.append('club', params.club);
    if (params?.search) searchParams.append('search', params.search);
    const query = searchParams.toString();
    return fetcher<Player[]>(`/players${query ? `?${query}` : ''}`);
  },
  getPlayer: (id: string) => fetcher<Player>(`/players/${id}`),
  getSimilarPlayers: (id: string) => fetcher<Player[]>(`/players/${id}/similar`),
  getPlayerWageEstimate: (id: string) => fetcher<WageEstimate>(`/players/${id}/wage-estimate`),
  getComparedPlayers: (ids: string[]) => fetcher<Player[]>(`/players/compare?ids=${ids.join(',')}`),

  // Clubs
  getClubs: () => fetcher<Club[]>('/clubs'),
  getClubSpending: (id: string) => fetcher<SpendingRecord[]>(`/clubs/${id}/spending`),

  // Rumors
  getRumors: (params?: { status?: string; club?: string; minReliability?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.club) searchParams.append('club', params.club);
    if (params?.minReliability) searchParams.append('minReliability', params.minReliability.toString());
    const query = searchParams.toString();
    return fetcher<Rumor[]>(`/rumors${query ? `?${query}` : ''}`);
  },
  getRumor: (id: string) => fetcher<Rumor>(`/rumors/${id}`),
  getRumorSummary: (id: string) => fetcher<RumorSummary>(`/rumors/${id}/summary`),

  // Contracts
  getExpiringContracts: (withinMonths?: number) => {
    const searchParams = new URLSearchParams();
    if (withinMonths) searchParams.append('withinMonths', withinMonths.toString());
    const query = searchParams.toString();
    return fetcher<Player[]>(`/contracts/expiring${query ? `?${query}` : ''}`);
  },

  // Transfers
  getTransfers: () => fetcher<TransferRecord[]>('/transfers')
};
