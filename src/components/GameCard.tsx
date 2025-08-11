import { GameSummary } from '@/types/rawg';

export default function GameCard({ game }: { game: GameSummary }) {
  return (
    <div className="rounded-2xl shadow p-3">
      <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
        {game.background_image && (
          <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="mt-2">
        <div className="font-medium">{game.name}</div>
        <div className="text-sm text-gray-500">
          {game.released ?? 'TBA'} · ⭐ {game.rating ?? '-'}
        </div>
      </div>
    </div>
  );
}
