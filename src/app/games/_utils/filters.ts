export type Ordering =
  | 'name'
  | '-name'
  | 'released'
  | '-released'
  | 'added'
  | '-added'
  | 'created'
  | '-created'
  | 'updated'
  | '-updated'
  | 'rating'
  | '-rating'
  | 'metacritic'
  | '-metacritic';

export interface GameFilters {
  search?: string;
  genres?: number[];
  platforms?: number[];
  ordering?: Ordering;
  page_size?: number;
}

function parseCsvNumbers(input: string | null | undefined): number[] | undefined {
  if (!input) return undefined;
  const nums = input
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isFinite(n));
  return nums.length ? nums : undefined;
}

function toCsv(nums: number[] | undefined): string | undefined {
  if (!nums || nums.length === 0) return undefined;
  return nums.join(',');
}

export function parseGameFilters(searchParams: URLSearchParams): GameFilters {
  const search = searchParams.get('search') ?? undefined;
  const genres = parseCsvNumbers(searchParams.get('genres'));
  const platforms = parseCsvNumbers(searchParams.get('platforms'));

  const orderingRaw = searchParams.get('ordering') ?? undefined;
  const allowed: Set<string> = new Set([
    'name',
    '-name',
    'released',
    '-released',
    'added',
    '-added',
    'created',
    '-created',
    'updated',
    '-updated',
    'rating',
    '-rating',
    'metacritic',
    '-metacritic',
  ]);
  const ordering = orderingRaw && allowed.has(orderingRaw) ? (orderingRaw as Ordering) : undefined;

  const pageSizeStr = searchParams.get('page_size');
  const page_size = pageSizeStr ? Number(pageSizeStr) : undefined;

  return {
    search: search?.trim() ? search.trim() : undefined,
    genres,
    platforms,
    ordering,
    page_size: Number.isFinite(page_size!) ? page_size : undefined,
  };
}

export function stringifyGameFilters(filters: GameFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.search) sp.set('search', filters.search);
  const genresCsv = toCsv(filters.genres);
  if (genresCsv) sp.set('genres', genresCsv);
  const platformsCsv = toCsv(filters.platforms);
  if (platformsCsv) sp.set('platforms', platformsCsv);
  if (filters.ordering) sp.set('ordering', filters.ordering);
  if (filters.page_size) sp.set('page_size', String(filters.page_size));
  return sp;
}

export function normalizeFilters(
  filters: GameFilters
): Required<Pick<GameFilters, never>> & GameFilters {
  return {
    ...filters,
    genres: filters.genres ? [...filters.genres].sort((a, b) => a - b) : undefined,
    platforms: filters.platforms ? [...filters.platforms].sort((a, b) => a - b) : undefined,
    search: filters.search?.trim() || undefined,
  };
}

export function mergeFilters(base: GameFilters, partial: Partial<GameFilters>): GameFilters {
  const next: GameFilters = { ...base, ...partial };

  if (next.search !== undefined && !next.search.trim()) next.search = undefined;

  if (next.genres && next.genres.length === 0) next.genres = undefined;
  if (next.platforms && next.platforms.length === 0) next.platforms = undefined;

  return next;
}
