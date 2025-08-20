'use client';

import { Button } from '@/components/ui/button';

type Props = {
  onReset: () => void;
  className?: string;
};

export default function FiltersResetButton({ onReset, className }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={onReset}
      aria-label="필터 초기화"
      title="필터 초기화"
    >
      필터 초기화
    </Button>
  );
}
