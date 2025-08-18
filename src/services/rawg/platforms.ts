import rawgClient from '@/lib/api/rawgClient';
import type { Platform } from '@/types/rawg';

type RawgListResponse<T> = { results: T[] };

export async function list(params?: { page_size?: number }): Promise<Platform[]> {
  const res = await rawgClient.get<RawgListResponse<Platform>>('/platforms', {
    page_size: params?.page_size ?? 60,
  });
  return res.results ?? [];
}
