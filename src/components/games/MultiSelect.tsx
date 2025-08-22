'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

type Item = { value: string | number; label: string };

interface MultiSelectProps {
  label: string;
  items: Item[];
  value: Array<string | number>;
  onChange?: (next: Array<string | number>) => void;
  placeholder?: string;
  ariaLabel?: string;
  searchPlaceholder?: string;
}

export default function MultiSelect({
  label,
  items,
  value,
  onChange,
  placeholder = '전체',
  ariaLabel,
  searchPlaceholder = '옵션 검색…',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedMap = useMemo(() => {
    const m = new Map<string | number, boolean>();
    value.forEach((v) => m.set(v, true));
    return m;
  }, [value]);

  const displayedItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.label.toLowerCase().includes(q));
  }, [items, query]);

  const toggle = (v: string | number) => {
    const next = selectedMap.has(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange?.(next);
  };

  const clearAll = () => {
    onChange?.([]);
    setQuery('');
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-label={ariaLabel ?? label}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="min-w-[180px] justify-between"
          >
            <span className="truncate">
              {value.length ? `${label}: ${value.length}개 선택` : `${label}: ${placeholder}`}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[280px] p-2">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-sm font-medium">{label}</span>
            {value.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                onClick={clearAll}
                aria-label={`${label} 선택 초기화`}
                title={`${label} 선택 초기화`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mb-2 px-1">
            <div className="relative">
              <input
                className="w-full rounded-md border px-2 py-1 pr-8 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                placeholder={searchPlaceholder}
                aria-label="옵션 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
                }}
              />
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="검색어 지우기"
                title="검색어 지우기"
                className={[
                  'absolute right-2 top-1/2 -translate-y-1/2 rounded p-1',
                  'transition-opacity',
                  query ? 'opacity-100' : 'opacity-0 pointer-events-none',
                ].join(' ')}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between px-1 text-xs text-gray-600">
            <span>
              표시: {displayedItems.length} / 전체 {items.length}
            </span>
            {value.length > 0 && (
              <button
                type="button"
                className="rounded-md border px-2 py-0.5 hover:bg-gray-50"
                onClick={clearAll}
                aria-label="선택 해제"
                title="선택 해제"
              >
                선택 해제
              </button>
            )}
          </div>

          <ScrollArea className="h-72 pr-2">
            <ul
              role="listbox"
              aria-label={label}
              aria-multiselectable="true"
              className="flex flex-col gap-1"
            >
              {displayedItems.length === 0 ? (
                <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                  결과가 없습니다
                </li>
              ) : (
                displayedItems.map((it) => {
                  const checked = selectedMap.has(it.value);
                  return (
                    <li key={String(it.value)} role="option" aria-selected={checked}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => toggle(it.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggle(it.value);
                          }
                        }}
                        className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                        aria-label={it.label}
                        title={it.label}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggle(it.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm">{it.label}</span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
