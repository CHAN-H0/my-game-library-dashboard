import rawgClient from '@/lib/api/rawgClient';
import type { Params } from '@/lib/api/rawgClient';
import type { GamesListResponse } from '@/types/rawg';
import type { GameDetails } from '@/types/rawg';
import type { GameFilters, Ordering } from '@/app/games/_utils/filters';

export interface GamesListParams {
  page?: number;
  page_size?: number;
  search?: string;
  genres?: string[] | string;
  platforms?: number[] | string;
  ordering?: Ordering | string;
  dates?: string;
}

type CsvInput = string | readonly string[] | readonly number[] | undefined;

function toCsv(vals: CsvInput): string | undefined {
  if (vals == null) return undefined;
  if (Array.isArray(vals)) {
    if (vals.length === 0) return undefined;
    return (vals as readonly (string | number)[]).join(',');
  }
  const s = String(vals).trim();
  return s ? s : undefined;
}

function normalizeGamesListParams(p: GamesListParams = {}): Params {
  return {
    page: p.page,
    page_size: p.page_size,
    search: p.search,
    ordering: (p.ordering as string) ?? undefined,
    dates: p.dates,
    genres: toCsv(p.genres),
    platforms: toCsv(p.platforms),
  };
}

export function toGamesListParamsFromFilters(f: GameFilters): GamesListParams {
  return {
    page_size: f.page_size,
    search: f.search,
    ordering: f.ordering,
    genres: f.genres,
    platforms: f.platforms,
  };
}

export const games = {
  list: (params: GamesListParams = {}, opts?: { signal?: AbortSignal; timeoutMs?: number }) =>
    rawgClient.get<GamesListResponse>('games', normalizeGamesListParams(params), {
      signal: opts?.signal,
      timeoutMs: opts?.timeoutMs,
    }),

  detail: (id: number | string, opts?: { signal?: AbortSignal; timeoutMs?: number }) =>
    rawgClient.get<GameDetails>(
      `games/${id}`,
      {},
      {
        signal: opts?.signal,
        timeoutMs: opts?.timeoutMs,
      }
    ),
};
