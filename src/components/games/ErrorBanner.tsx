'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  message?: string;
  statusText?: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorBanner({ message, statusText, onRetry, className }: Props) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900',
        className ?? '',
      ].join(' ')}
    >
      <div className="font-medium">불러오는 중 문제가 발생했어요.</div>
      <div className="mt-1">
        {message ?? '알 수 없는 오류'}
        {statusText ? ` (${statusText})` : ''}
      </div>
      {onRetry && (
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={onRetry} aria-label="다시 시도">
            다시 시도
          </Button>
        </div>
      )}
    </div>
  );
}
