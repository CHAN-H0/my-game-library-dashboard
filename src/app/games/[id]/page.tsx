'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useGame } from '@/app/games/_hooks/useGame';
import ErrorBanner from '@/components/games/ErrorBanner';

export default function GameDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const gameId = useMemo(() => Number(params?.id), [params?.id]);
  const { data, isPending, isError, error, refetch } = useGame(gameId);

  const [expanded, setExpanded] = useState(false);
  const descriptionRaw = data?.description_raw ?? '';
  const paragraphs = useMemo(
    () =>
      descriptionRaw
        .split(/\r?\n\s*\r?\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    [descriptionRaw]
  );
  const totalChars = useMemo(() => descriptionRaw.length, [descriptionRaw]);

  const MIN_TOTAL_TO_CLAMP = 600;
  const MIN_EXCERPT_CHARS = 280;
  const LONG_PARA_CHARS = 800;
  const MAX_EXCERPT_PARAS = 2;
  const MIN_TOTAL_TO_TOGGLE = 1400;
  const MIN_HIDDEN_CHARS = 500;
  const MIN_HIDDEN_RATIO = 0.38;

  const previewParas = useMemo(() => {
    if (totalChars < MIN_TOTAL_TO_CLAMP) return paragraphs;
    if (paragraphs.length === 0) return [];
    const first = paragraphs[0];
    if (first.length >= MIN_EXCERPT_CHARS) return [first];
    if (paragraphs.length > 1)
      return paragraphs.slice(0, Math.min(MAX_EXCERPT_PARAS, paragraphs.length));
    return [first];
  }, [paragraphs, totalChars]);

  const previewChars = useMemo(() => previewParas.join('\n\n').length, [previewParas]);
  const hiddenChars = Math.max(0, totalChars - previewChars);
  const hiddenRatio = totalChars ? hiddenChars / totalChars : 0;
  const canToggle =
    totalChars >= MIN_TOTAL_TO_TOGGLE &&
    (hiddenChars >= MIN_HIDDEN_CHARS ||
      hiddenRatio >= MIN_HIDDEN_RATIO ||
      (previewParas.length === 1 && previewParas[0].length > LONG_PARA_CHARS));
  const showToggle = canToggle;

  const needsHeightClamp =
    canToggle && !expanded && previewParas.length === 1 && previewParas[0].length > LONG_PARA_CHARS;

  if (!Number.isFinite(gameId)) {
    return (
      <div className="p-6">
        잘못된 접근입니다.{` `}
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

  const { name, background_image, released, rating, metacritic, genres, platforms } = data;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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

      {descriptionRaw ? (
        <section aria-labelledby="desc-title" className="max-w-none">
          <h2 id="desc-title" className="sr-only">
            설명
          </h2>

          <div
            id="desc-content"
            className="prose dark:prose-invert leading-relaxed"
            aria-live="polite"
          >
            {(expanded || !canToggle ? paragraphs : previewParas).map((p, i) => (
              <p
                key={i}
                className={
                  needsHeightClamp && i === 0
                    ? 'relative max-h-[16rem] overflow-hidden whitespace-pre-wrap after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-16 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent'
                    : 'whitespace-pre-wrap'
                }
              >
                {p}
              </p>
            ))}
          </div>

          {showToggle && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls="desc-content"
              >
                {expanded ? '접기' : '더보기'}
              </Button>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
