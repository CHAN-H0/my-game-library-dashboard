import TestClient from './testClient';

export default async function TestPage() {
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );
  const data = await res.json();

  const plainResults = data.results.map((game: any) => ({
    id: game.id,
    name: game.name,
  }));

  return <TestClient games={plainResults} />;
}
