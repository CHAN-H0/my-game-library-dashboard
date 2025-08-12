import rawgClient from '@/lib/api/rawgClient';
import type { Params } from '@/lib/api/rawgClient';
import type { GamesListResponse, GameSummary } from '@/types/rawg';

export interface GamesListParams extends Params {
  page?: number;
  page_size?: number;
  search?: string;
  genres?: number[];
  platforms?: number[];
  ordering?: string;
  dates?: string;
}

export const games = {
  list: (params: GamesListParams = {}, opts?: { signal?: AbortSignal; timeoutMs?: number }) =>
    rawgClient.get<GamesListResponse>('games', params, {
      signal: opts?.signal,
      timeoutMs: opts?.timeoutMs,
    }),

  detail: (id: number | string, opts?: { signal?: AbortSignal; timeoutMs?: number }) =>
    rawgClient.get<GameSummary & { description_raw?: string }>(
      `games/${id}`,
      {},
      { signal: opts?.signal, timeoutMs: opts?.timeoutMs }
    ),
};
