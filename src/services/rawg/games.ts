import rawgClient from '@/lib/api/rawgClient';
import { GamesListResponse, GameSummary } from '@/types/rawg';

export const games = {
  list: (params: Record<string, any> = {}) => rawgClient.get<GamesListResponse>('games', params),
  detail: (id: number | string) =>
    rawgClient.get<GameSummary & { description_raw?: string }>(`/games/${id}`),
};
