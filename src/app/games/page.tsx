'use client';

import { useGames } from '@/queries/games';
import dynamic from 'next/dynamic';

const GameGrid = dynamic(() => import('@/components/GameGrid'), {
  loading: () => <div>로딩 중...</div>,
  ssr: true,
});

export default function GamesPage() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGames();

  if (isLoading) return <div className="p-6">로딩 중...</div>;
  if (isError) {
    const e = error as any;
    return (
      <div className="p-6 text-red-600">
        에러: {e?.message || '알 수 없는 에러'}
        {'status' in e && e.status ? ` (HTTP ${e.status})` : null}
      </div>
    );
  }

  const items = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Games</h1>
      {items.length === 0 ? (
        <div>결과가 없어요.</div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">{items.length}개 표시</div>
          <div className="space-y-6">
            <GameGrid games={items} />
          </div>
          {hasNextPage && (
            <button
              className="mt-6 px-4 py-2 rounded-xl border"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? '불러오는 중…' : '더 보기'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
