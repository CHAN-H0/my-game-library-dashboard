'use client';

import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  parseGameFilters,
  stringifyGameFilters,
  mergeFilters,
  GameFilters,
  Ordering,
} from './_utils/filters';
import { useInfiniteGames } from '@/queries/games';
import GameGrid from '@/components/GameGrid';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import SearchBar from '@/components/games/SearchBar';

export default function GamesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo<GameFilters>(
    () => parseGameFilters(new URLSearchParams(searchParams?.toString())),
    [searchParams]
  );

  const {
    data,
    error,
    isError,
    isPending,
    refetch,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteGames(filters);

  const updateFilters = useCallback(
    (partial: Partial<GameFilters>) => {
      const merged = mergeFilters(filters, partial);
      const sp = stringifyGameFilters(merged);
      const qs = sp.toString();
      router.replace(qs ? `/games?${qs}` : '/games');
    },
    [router, filters]
  );

  const onChangeOrdering = (orderingValue: string) => {
    updateFilters({
      ordering: orderingValue === 'popularity' ? undefined : (orderingValue as Ordering),
    });
  };

  const items = useMemo(() => data?.pages.flatMap((p: any) => p.results) ?? [], [data]);

  const showInitialLoading = (isPending || (!data && isFetching)) && items.length === 0;
  if (showInitialLoading) return <div className="p-6">로딩 중…</div>;

  if (isError) {
    const e = error as any;
    return (
      <div className="p-6 text-red-600">
        에러: {e?.message || '알 수 없는 에러'}
        {'status' in e && e?.status ? ` (HTTP ${e.status})` : null}
      </div>
    );
  }

  const orderingValue = filters.ordering ?? 'popularity';
  const isBackgroundUpdating = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar placeholder="게임 검색 (Enter)" className="max-w-md" />
        </div>
        <Select value={orderingValue} onValueChange={onChangeOrdering}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">인기순(기본)</SelectItem>
            <SelectItem value="-rating">평점순</SelectItem>
            <SelectItem value="-metacritic">메타크리틱순</SelectItem>
            <SelectItem value="-released">최신 출시순</SelectItem>
            <SelectItem value="released">오래된 출시순</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => refetch()}
          disabled={isFetching && !isFetchingNextPage}
          aria-live="polite"
        >
          {isFetching && !isFetchingNextPage ? '업데이트 중…' : '최신 가져오기'}
        </Button>

        {isBackgroundUpdating && <span className="ml-2 text-sm text-gray-500">업데이트 중…</span>}
      </div>

      {items.length === 0 ? (
        <div>결과가 없어요.</div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">{items.length}개 표시</div>
          <div className="space-y-6">
            <GameGrid games={items} />
          </div>

          {hasNextPage && (
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? '로딩…' : '더 보기'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
