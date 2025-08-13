import rawgClient from '@/lib/api/rawgClient';
export const genres = {
  list: () => rawgClient.get<{ results: { id: number; name: string }[] }>('/genres'),
};
