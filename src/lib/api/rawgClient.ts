const BASE_URL = 'https://api.rawg.io/api/';

export class RawgApiError extends Error {
  public readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'RawgApiError';
    this.status = status;
  }
}

type ParamValue = string | number | boolean | null | undefined | (string | number)[];
type Params = Record<string, ParamValue>;

function buildUrl(path: string, apiKey: string, params: Params) {
  const safePath = path.replace(/^\/+/, '');
  const url = new URL(safePath, BASE_URL);
  url.searchParams.set('key', apiKey);
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    if (Array.isArray(v)) url.searchParams.set(k, v.join(','));
    else url.searchParams.set(k, String(v));
  }
  console.log('[RAWG 요청 URL]', url.toString());
  return url.toString();
}

async function safeParseError(res: Response) {
  let msg = res.statusText || `HTTP ${res.status}`;
  try {
    const ctype = res.headers.get('content-type') || '';
    if (ctype.includes('application/json')) {
      const body = await res.json();
      msg = body?.detail || body?.error || msg;
    } else {
      const text = await res.text();
      msg = text || msg;
    }
  } catch {}
  return msg;
}

export const rawgClient = {
  async get<T>(path: string, params: Params = {}, options: RequestInit = {}): Promise<T> {
    const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
    if (!apiKey) {
      throw new Error(
        'RAWG API 키가 없습니다. .env.local에 NEXT_PUBLIC_RAWG_API_KEY를 설정해주세요.'
      );
    }

    const url = buildUrl(path, apiKey, params);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(url, { cache: 'no-store', signal: ctrl.signal, ...options });
    } catch (e: any) {
      clearTimeout(timer);
      throw new RawgApiError(0, e?.message || '네트워크 오류가 발생했습니다.');
    }
    clearTimeout(timer);

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = Number(response.headers.get('retry-after')) || 1;
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        return this.get<T>(path, params, options);
      }
      const message = await safeParseError(response);
      throw new RawgApiError(response.status, message);
    }
    return response.json() as Promise<T>;
  },
};

export default rawgClient;
