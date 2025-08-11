import rawgClient from '@/lib/api/rawgClient';
export const platforms = {
  list: () => rawgClient.get<{ results: { id: number; name: string }[] }>('/platforms'),
};
