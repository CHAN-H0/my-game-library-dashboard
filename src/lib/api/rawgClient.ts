const BASE_URL = 'https://api.rawg.io/api/';

export class RawgApiError extends Error {
  public readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'RawgApiError';
    this.status = status;
  }
}

export type ParamValue = string | number | boolean | null | undefined | (string | number)[];
export type Params = Record<string, ParamValue>;

function buildUrl(path: string, apiKey: string, params: Params) {
  const safePath = path.replace(/^\/+/, '');
  const url = new URL(safePath, BASE_URL);
  url.searchParams.set('key', apiKey);
  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;
    if (Array.isArray(v)) url.searchParams.set(k, v.join(','));
    else url.searchParams.set(k, String(v));
  }
  // 개발 중 확인용
  // console.log('[RAWG 요청 URL]', url.toString());
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

function createAbortError(message = 'Aborted') {
  const err = new Error(message);
  (err as any).name = 'AbortError';
  return err;
}

function waitWithAbort(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);
    const onAbort = () => {
      cleanup();
      reject(createAbortError());
    };
    const cleanup = () => {
      clearTimeout(t);
      signal?.removeEventListener('abort', onAbort);
    };
    if (signal) {
      if (signal.aborted) return onAbort();
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

export type GetOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  maxRetries?: number;
};

export const rawgClient = {
  async get<T>(path: string, params: Params = {}, opts: GetOptions = {}): Promise<T> {
    const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
    if (!apiKey) {
      throw new Error(
        'RAWG API 키가 없습니다. .env.local에 NEXT_PUBLIC_RAWG_API_KEY를 설정해주세요.'
      );
    }

    const url = buildUrl(path, apiKey, params);

    const { signal, timeoutMs = 10_000, maxRetries = 1 } = opts;
    const ctrl = new AbortController();

    if (signal) {
      if (signal.aborted) ctrl.abort();
      else signal.addEventListener('abort', () => ctrl.abort(), { once: true });
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
      timer = setTimeout(() => ctrl.abort(), timeoutMs);
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        signal: ctrl.signal,
      });

      if (!response.ok) {
        if (response.status === 429 && maxRetries > 0) {
          const retryAfter = Number(response.headers.get('retry-after')) || 1;
          await waitWithAbort(retryAfter * 1000, signal ?? ctrl.signal);
          return this.get<T>(path, params, {
            signal,
            timeoutMs,
            maxRetries: maxRetries - 1,
          });
        }

        const message = await safeParseError(response);
        throw new RawgApiError(response.status, message);
      }

      return (await response.json()) as T;
    } catch (e: any) {
      if (e?.name === 'AbortError') throw e;
      throw new RawgApiError(0, e?.message || '네트워크 오류가 발생했습니다.');
    } finally {
      if (timer) clearTimeout(timer);
    }
  },
};

export default rawgClient;
