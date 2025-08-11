export type GameSummary = {
  id: number;
  name: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number;
  genres?: { id: number; name: string }[];
  platforms?: { platform: { id: number; name: string } }[];
};

export type GamesListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameSummary[];
};
