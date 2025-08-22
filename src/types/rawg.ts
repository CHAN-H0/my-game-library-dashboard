export type GameSummary = {
  id: number;
  name: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number;
  genres?: Genre[];
  platforms?: { platform: Platform }[];
};

export type RawgListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
export type GamesListResponse = RawgListResponse<GameSummary>;

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface GameDetails {
  id: number;
  name: string;
  description_raw?: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number | null;
  metacritic?: number | null;
  genres?: Genre[];
  platforms?: { platform: Platform }[];
  website?: string | null;
}
