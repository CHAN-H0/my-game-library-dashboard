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

export default function GamesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL → 객체
  const filters = useMemo<GameFilters>(() => {
    return parseGameFilters(new URLSearchParams(searchParams?.toString()));
  }, [searchParams]);

  // 데이터 로드 (훅 내부에서 normalize + placeholderData 적용 가정)
  const {
    data,
    error,
    isError,
    isPending, // 초기 로딩
    isFetching, // 어떤 페치든 진행 중
    isFetchingNextPage, // 다음 페이지 페치 중
    fetchNextPage,
    hasNextPage,
  } = useInfiniteGames(filters);

  // URL만 갱신 (상태의 단일 소스 = URL)
  const updateFilters = useCallback(
    (partial: Partial<GameFilters>) => {
      const merged = mergeFilters(filters, partial);
      const sp = stringifyGameFilters(merged);
      const qs = sp.toString();
      router.replace(qs ? `/games?${qs}` : '/games');
    },
    [router, filters]
  );

  // 예시: 정렬 변경
  const onChangeOrdering = (orderingValue: string) => {
    // "인기순(기본)"은 ordering을 지정하지 않음 (RAWG 기본 인기순 사용)
    updateFilters({
      ordering: orderingValue === 'popularity' ? undefined : (orderingValue as Ordering),
    });
  };

  // 예시: 초기화
  const onReset = () => router.replace('/games');

  // 평탄화 아이템
  const items = data?.pages.flatMap((p: any) => p.results) ?? [];

  // "처음 진입"에만 전체 로딩
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

  // 필터 활성 여부(초기화 버튼 노출 조건)
  const hasActiveFilters = !!(
    filters.search ||
    filters.genres?.length ||
    filters.platforms?.length ||
    filters.ordering ||
    filters.page_size
  );

  // 필터 변경 등 백그라운드 갱신 상태
  const isBackgroundUpdating = isFetching && !isFetchingNextPage && items.length > 0;

  // Select의 value: ordering이 없으면 'popularity'
  const orderingValue = filters.ordering ?? 'popularity';

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* 정렬 드롭다운 */}
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

        {hasActiveFilters && (
          <Button variant="ghost" onClick={onReset}>
            초기화
          </Button>
        )}

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
