import { useInfiniteQuery } from '@tanstack/react-query';
import { games } from '@/services/rawg/games';

export function useGames() {
  return useInfiniteQuery({
    queryKey: ['games'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => games.list({ page: pageParam }),
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
  });
}
