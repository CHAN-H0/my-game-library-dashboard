'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { games } from '@/services/rawg/games';
import { GameDetails } from '@/types/rawg';

export function useGame(id: number) {
  return useQuery<GameDetails>({
    queryKey: ['rawg', 'game', id],
    queryFn: () => games.detail(id),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: Number.isFinite(id),
  });
}
