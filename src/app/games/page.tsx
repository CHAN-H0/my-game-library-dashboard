'use client';

import { useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  parseGameFilters,
  stringifyGameFilters,
  mergeFilters,
  GameFilters,
  Ordering,
  resetGameFilters,
} from './_utils/filters';
import { useInfiniteGames } from '@/queries/games';
import GameGrid from '@/components/GameGrid';
import { Button } from '@/components/ui/button';
import FiltersResetButton from '@/components/games/FiltersResetButton';
import ErrorBanner from '@/components/games/ErrorBanner';
import EmptyState from '@/components/games/EmptyState';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import SearchBar from '@/components/games/SearchBar';
import FiltersPanel from '@/components/games/FiltersPanel';

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

  const handleResetFilters = useCallback(() => {
    const next = resetGameFilters(filters, { keepOrdering: true, keepPageSize: true });
    const sp = stringifyGameFilters(next);
    const qs = sp.toString();
    router.replace(qs ? `/games?${qs}` : '/games');
  }, [filters, router]);

  const items = useMemo(() => data?.pages.flatMap((p: any) => p.results) ?? [], [data]);

  const showInitialLoading = (isPending || (!data && isFetching)) && items.length === 0;
  if (showInitialLoading) return <div className="p-6">로딩 중…</div>;

  const orderingValue = filters.ordering ?? 'popularity';
  const isBackgroundUpdating = isFetching && !isFetchingNextPage && items.length > 0;
  const isEmpty = !isPending && !isFetching && !isError && items.length === 0;

  const errorMessage = (error as any)?.message as string | undefined;
  const errorStatus = (error as any)?.status ? `HTTP ${(error as any).status}` : undefined;

  return (
    <div className="space-y-4 p-6">
      <div className="grid gap-3">
        <div role="group" aria-labelledby="search-controls" className="flex items-center gap-2">
          <h2 id="search-controls" className="sr-only">
            검색
          </h2>
          <SearchBar placeholder="게임 검색 (Enter)" className="max-w-md" />
        </div>

        <div
          role="group"
          aria-labelledby="filter-controls"
          className="flex flex-wrap items-center gap-2"
        >
          <h2 id="filter-controls" className="sr-only">
            필터
          </h2>
          <FiltersPanel filters={filters} onChange={updateFilters} />
          <FiltersResetButton onReset={handleResetFilters} />
        </div>

        <div
          role="group"
          aria-labelledby="sort-controls"
          className="flex flex-wrap items-center gap-2"
        >
          <h2 id="sort-controls" className="sr-only">
            정렬 및 새로고침
          </h2>
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
            className="shrink-0"
          >
            {isFetching && !isFetchingNextPage ? '업데이트 중…' : '최신 가져오기'}
          </Button>

          {isBackgroundUpdating && (
            <span className="text-sm text-gray-500" aria-live="polite">
              업데이트 중…
            </span>
          )}
        </div>
      </div>

      {isError && (
        <ErrorBanner message={errorMessage} statusText={errorStatus} onRetry={() => refetch()} />
      )}

      {isEmpty ? (
        <EmptyState onReset={handleResetFilters} />
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
