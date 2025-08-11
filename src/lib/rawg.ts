const BASE = 'https://api.rawg.io/api';

export async function rawg<T>(
  path: string,
  params: Record<string, string | number> = {}
) {
  const key = process.env.NEXT_PUBLIC_RAWG_API_KEY!;
  const url = new URL(path, BASE);
  url.searchParams.set('key', key);
  for (const [k, v] of Object.entries(params))
    url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`RAWG ${res.status}`);
  return (await res.json()) as T;
}
