'use client';

export default function TestClient({
  games,
}: {
  games: { id: number; name: string }[];
}) {
  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>{game.name}</li>
      ))}
    </ul>
  );
}
