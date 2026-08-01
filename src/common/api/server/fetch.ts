import 'server-only';
import { cookies } from 'next/headers';

import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  resolveContentType,
  resolveQuery,
  resolveBody,
  fetchResponse,
  type ContentType,
} from '@/common/api/shared/fetch';

export type CacheStrategy =
  | { type: 'no-store' }
  | { type: 'force-cache' }
  | { type: 'revalidate'; seconds: number }
  | { type: 'tags'; tags: string[] };

export type AuthType = 'access' | 'refresh' | 'none';

interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig;
  baseUrl?: string;
  authType?: AuthType;
  cacheStrategy?: CacheStrategy;
  contentType?: ContentType;
}

const API_URL = process.env.API_URL!;
const API_KEY = process.env.API_KEY!;

const resolveAuthOptions = async (authType: AuthType) => {
  if (authType === 'none') return null;

  const cookieStore = await cookies();
  const cookieKey = authType === 'access' ? 'accessToken' : 'refreshToken';
  const bearerToken = cookieStore.get(cookieKey)?.value;

  if (!bearerToken) {
    throw new ApiError(
      ResponseCode.UNAUTHORIZED.code,
      ResponseCode.UNAUTHORIZED.message,
    );
  }

  return bearerToken;
};

const resolveCacheOptions = (
  strategy?: CacheStrategy,
): Pick<RequestInit, 'cache' | 'next'> => {
  if (!strategy) {
    return { cache: 'no-store' };
  }

  switch (strategy.type) {
    case 'no-store':
      return { cache: 'no-store' };

    case 'force-cache':
      return { cache: 'force-cache' };

    case 'revalidate':
      return {
        next: { revalidate: strategy.seconds },
      };

    case 'tags':
      return {
        next: { tags: strategy.tags },
      };
  }
};

const resolveUrl = (input: string, baseUrl?: string) => {
  if (!baseUrl) {
    return `${API_URL}${input}`;
  }
  const separator = baseUrl.endsWith('/') || input.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${input}`;
};

const serverFetch = async <T>(
  input: string,
  options: FetchOptions = {},
): Promise<T> => {
  const {
    authType = 'none',
    cacheStrategy,
    contentType = 'JSON',
    baseUrl = API_URL,
    ...init
  } = options;

  const bearerToken = await resolveAuthOptions(authType);
  const cacheOptions = resolveCacheOptions(cacheStrategy);
  const contentOptions = resolveContentType(contentType);
  const urlOptions = resolveUrl(input, baseUrl);

  const res = await fetch(urlOptions, {
    ...init,
    ...cacheOptions,
    headers: {
      ...(contentOptions && { 'Content-Type': contentOptions }),
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
      ...{ 'X-API-Key': API_KEY },
      ...init?.headers,
    },
  });

  return fetchResponse(res);
};

export const ServerRequest = {
  apiGet: async <T>(
    input: string,
    options?: Omit<FetchOptions, 'contentType'>,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> => {
    const query = resolveQuery(params);

    return serverFetch<T>(`${input}${query}`, {
      method: 'GET',
      ...options,
    });
  },

  apiPost: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'POST',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiPut: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'PUT',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiPatch: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'PATCH',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiDelete: async <T = void>(
    input: string,
    options?: Omit<FetchOptions, 'contentType'>,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'DELETE',
      ...options,
    });
  },
};
