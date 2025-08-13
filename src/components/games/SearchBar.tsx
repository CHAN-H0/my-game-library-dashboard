'use client';

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import {
  parseGameFilters,
  mergeFilters,
  normalizeFilters,
  stringifyGameFilters,
} from '@/app/games/_utils/filters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  placeholder?: string;
  className?: string;
};

export default function SearchBar({ placeholder = '게임 검색 (Enter)', className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const urlSearch = sp.get('search') ?? '';
  const [value, setValue] = useState(urlSearch);
  const debounced = useDebouncedValue(value, 300);

  useEffect(() => {
    const next = sp.get('search') ?? '';
    setValue(next);
  }, [urlSearch]);

  const disabled = useMemo(
    () => debounced.trim() === (urlSearch ?? '').trim(),
    [debounced, urlSearch]
  );

  const applySearch = (q: string) => {
    const current = parseGameFilters(new URLSearchParams(sp));
    const merged = normalizeFilters(mergeFilters(current, { search: q.trim() || undefined }));
    const qs = stringifyGameFilters(merged).toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const handleSubmit = () => applySearch(value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const clear = () => {
    setValue('');
    applySearch('');
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="게임 검색"
      />
      <Button type="button" onClick={handleSubmit} disabled={disabled}>
        검색
      </Button>
      {urlSearch && (
        <Button type="button" variant="secondary" onClick={clear}>
          지우기
        </Button>
      )}
    </div>
  );
}
