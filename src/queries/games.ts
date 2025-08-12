import { useMemo } from 'react';
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { games } from '@/services/rawg/games';
import { GameFilters, normalizeFilters } from '@/app/games/_utils/filters';

export function useInfiniteGames(filters: GameFilters) {
  const normalized = useMemo(() => normalizeFilters(filters), [filters]);

  return useInfiniteQuery({
    queryKey: ['games', normalized],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      games.list({
        page: pageParam,
        ...normalized,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get('page');
        return nextPage ? Number(nextPage) : undefined;
      } catch {
        return undefined;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
