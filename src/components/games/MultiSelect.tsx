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
}

export default function MultiSelect({
  label,
  items,
  value,
  onChange,
  placeholder = '전체',
  ariaLabel,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedMap = useMemo(() => {
    const m = new Map<string | number, boolean>();
    value.forEach((v) => m.set(v, true));
    return m;
  }, [value]);

  const toggle = (v: string | number) => {
    const next = selectedMap.has(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange?.(next);
  };

  const clearAll = () => onChange?.([]);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-label={ariaLabel ?? label}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="justify-between min-w-[180px]"
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
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <ScrollArea className="h-72 pr-2">
            <ul
              role="listbox"
              aria-label={label}
              aria-multiselectable="true"
              className="flex flex-col gap-1"
            >
              {items.map((it) => {
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
                      className="w-full cursor-pointer select-none rounded-lg px-2 py-1.5 hover:bg-muted flex items-center gap-2"
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggle(it.value)} />
                      <span className="text-sm">{it.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
