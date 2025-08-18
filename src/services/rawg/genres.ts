import rawgClient from '@/lib/api/rawgClient';
import type { Genre } from '@/types/rawg';

type RawgListResponse<T> = { results: T[] };

export async function list(params?: { page_size?: number }): Promise<Genre[]> {
  const res = await rawgClient.get<RawgListResponse<Genre>>('/genres', {
    page_size: params?.page_size ?? 40,
  });
  return res.results ?? [];
}
