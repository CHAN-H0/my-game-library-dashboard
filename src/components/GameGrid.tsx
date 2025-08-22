'use client';

import Link from 'next/link';
import type { GameSummary } from '@/types/rawg';
import GameCard from './GameCard';

type Props = {
  games: GameSummary[];
};

export default function GameGrid({ games }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {games.map((g) => (
        <Link
          key={g.id}
          href={`/games/${g.id}`}
          aria-label={`${g.name} 상세 보기`}
          className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          <GameCard game={g} />
        </Link>
      ))}
    </div>
  );
}
