'use client';

import { useQuery } from '@tanstack/react-query';
import * as genresSvc from '@/services/rawg/genres';
import type { Genre } from '@/types/rawg';

export default function useGenres() {
  return useQuery<Genre[]>({
    queryKey: ['rawg', 'genres'],
    queryFn: () => genresSvc.list(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
