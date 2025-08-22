'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGame } from '@/app/games/_hooks/useGame';
import ErrorBanner from '@/components/games/ErrorBanner';

export default function GameDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const gameId = useMemo(() => Number(params?.id), [params?.id]);
  const { data, isPending, isError, error, refetch } = useGame(gameId);

  if (!Number.isFinite(gameId)) {
    return (
      <div className="p-6">
        잘못된 접근입니다.{' '}
        <Button variant="outline" className="ml-2" onClick={() => router.push('/games')}>
          목록으로
        </Button>
      </div>
    );
  }

  if (isPending && !data) {
    return <div className="p-6">로딩 중…</div>;
  }

  if (isError) {
    const e = error as any;
    return (
      <div className="p-6 space-y-3">
        <ErrorBanner
          message={e?.message ?? '알 수 없는 오류'}
          statusText={e?.status ? `HTTP ${e.status}` : undefined}
          onRetry={() => refetch()}
        />
        <Button variant="outline" onClick={() => router.push('/games')} aria-label="목록으로">
          목록으로
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const {
    name,
    background_image,
    released,
    rating,
    metacritic,
    description_raw,
    genres,
    platforms,
  } = data;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* 썸네일 */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border sm:w-[360px]">
          {background_image ? (
            <Image
              src={background_image}
              alt={`${name} 배경 이미지`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 360px"
              priority
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              이미지 없음
            </div>
          )}
        </div>

        {/* 메타 정보 */}
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-semibold leading-tight">{name}</h1>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
            {released ? <span>발매: {released}</span> : null}
            {typeof rating === 'number' ? <span>평점: {rating.toFixed(1)}</span> : null}
            {typeof metacritic === 'number' ? <span>메타크리틱: {metacritic}</span> : null}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {(genres ?? []).map((g) => (
              <span key={g.id} className="rounded-full border px-2 py-0.5 text-xs">
                {g.name}
              </span>
            ))}
            {(platforms ?? []).map((p) => (
              <span key={p.platform.id} className="rounded-full border px-2 py-0.5 text-xs">
                {p.platform.name}
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.push('/games')} aria-label="목록으로">
              목록으로
            </Button>
          </div>
        </div>
      </div>

      {description_raw ? (
        <section aria-labelledby="desc-title" className="prose dark:prose-invert max-w-none">
          <h2 id="desc-title" className="sr-only">
            설명
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed">{description_raw}</p>
        </section>
      ) : null}
    </div>
  );
}
