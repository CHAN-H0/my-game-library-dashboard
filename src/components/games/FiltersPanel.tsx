'use client';

import MultiSelect from './MultiSelect';
import useGenres from '@/app/games/_hooks/useGenres';
import usePlatforms from '@/app/games/_hooks/usePlatforms';
import { GameFilters } from '@/app/games/_utils/filters';

type Props = {
  filters: GameFilters;
  onChange: (next: GameFilters) => void;
};

export default function FiltersPanel({ filters, onChange }: Props) {
  const { data: genres = [], isLoading: gLoading } = useGenres();
  const { data: platforms = [], isLoading: pLoading } = usePlatforms();

  const genreItems = (genres ?? []).map((g) => ({ value: g.slug, label: g.name }));
  const platformItems = (platforms ?? []).map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <MultiSelect
        label="장르"
        items={genreItems}
        value={filters.genres ?? []}
        onChange={(vals) => {
          onChange({ ...filters, genres: vals as string[] });
        }}
        placeholder={gLoading ? '불러오는 중…' : '전체'}
        ariaLabel="장르 다중 선택"
      />
      <MultiSelect
        label="플랫폼"
        items={platformItems}
        value={(filters.platforms ?? []) as Array<number>}
        onChange={(vals) => {
          const next = (vals as Array<string | number>).map((v) => Number(v));
          onChange({ ...filters, platforms: next });
        }}
        placeholder={pLoading ? '불러오는 중…' : '전체'}
        ariaLabel="플랫폼 다중 선택"
      />
    </div>
  );
}
