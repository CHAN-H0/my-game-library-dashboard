'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  onReset?: () => void;
  className?: string;
};

export default function EmptyState({ onReset, className }: Props) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center rounded-xl border border-gray-200 px-6 py-12 text-center',
        className ?? '',
      ].join(' ')}
    >
      <h3 className="text-base font-semibold text-gray-900">조건에 맞는 게임이 없습니다</h3>
      <p className="mt-1 text-sm text-gray-600">필터를 변경하거나 초기화해 다시 시도해 보세요.</p>
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onReset}
          aria-label="필터 초기화"
          title="필터 초기화"
        >
          필터 초기화
        </Button>
      )}
    </div>
  );
}
