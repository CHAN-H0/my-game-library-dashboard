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
  genres?: string[];
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

function parseCsvStrings(input: string | null | undefined): string[] | undefined {
  if (!input) return undefined;
  const arr = input
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

function toCsv<T extends string | number>(vals: T[] | undefined): string | undefined {
  if (!vals || vals.length === 0) return undefined;
  return vals.join(',');
}

const ALLOWED_ORDERING = new Set<Ordering>([
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

export function parseGameFilters(searchParams: URLSearchParams): GameFilters {
  const search = searchParams.get('search') ?? undefined;
  const genres = parseCsvStrings(searchParams.get('genres'));
  const platforms = parseCsvNumbers(searchParams.get('platforms'));

  const orderingRaw = searchParams.get('ordering') ?? undefined;
  const ordering =
    orderingRaw && ALLOWED_ORDERING.has(orderingRaw as Ordering)
      ? (orderingRaw as Ordering)
      : undefined;

  const pageSizeStr = searchParams.get('page_size');
  const pageSizeNum = pageSizeStr ? Number(pageSizeStr) : NaN;

  return {
    search: search?.trim() ? search.trim() : undefined,
    genres,
    platforms,
    ordering,
    page_size: Number.isFinite(pageSizeNum) ? pageSizeNum : undefined,
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
    genres: filters.genres ? [...filters.genres].sort() : undefined,
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

export function resetGameFilters(
  current: GameFilters,
  opts: { keepOrdering?: boolean; keepPageSize?: boolean } = {
    keepOrdering: true,
    keepPageSize: true,
  }
): GameFilters {
  const next: GameFilters = {};
  if (opts.keepOrdering && current.ordering) next.ordering = current.ordering;
  if (opts.keepPageSize && typeof current.page_size === 'number')
    next.page_size = current.page_size;
  return next;
}
