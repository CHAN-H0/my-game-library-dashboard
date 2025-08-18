'use client';

import { useQuery } from '@tanstack/react-query';
import * as platformsSvc from '@/services/rawg/platforms';
export default function usePlatforms() {
  return useQuery({
    queryKey: ['rawg', 'platforms'],
    queryFn: () => platformsSvc.list(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
