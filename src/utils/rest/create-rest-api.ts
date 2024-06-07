import * as R from 'ramda';
import { z } from 'zod';

import { logger } from '~/services/logger';
import { RestApiError } from './rest-api-error';

interface ErrorResponse {
  message?: string;
  stackTrace?: string;
}

export function createRestApi(apiEndpoint: string) {
  /**
   * Makes a request to API. Throws the response if status code >= 400.
   * @throws Response
   */
  async function apiRequest(
    path: string,
    init?: RequestInit
  ): Promise<Response | undefined> {
    const info = {
      api: apiEndpoint,
      path,
      method: init?.method ?? 'GET'
    };
    logger.debug('external api request', { ...info, namespace: 'app:rest' });

    const response = await fetch(`${apiEndpoint}${path}`, init);
    if (response.status >= 400) {
      logger.warn('external api request failed to fetch', {
        ...info,
        status: response.status
      });
      throw new Response(response.body, { status: response.status });
    }
    if (response.status === 204) {
      return undefined;
    }
    return response;
  }

  /**
   * Makes a request to REST API.
   * @throws RestApiError | Error | unknown
   */
  async function apiJsonRequest<TResponseSchema extends z.ZodTypeAny>(
    path: string,
    schema: TResponseSchema,
    init?: RequestInit
  ): Promise<z.infer<TResponseSchema> | undefined> {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers
    };

    let response: Response | undefined;
    try {
      response = await apiRequest(path, { ...init, headers });
    } catch (error) {
      if (error instanceof Response) {
        try {
          const { message, stackTrace } = (await error.json()) as ErrorResponse;
          throw new RestApiError(
            error.status,
            message || error.statusText,
            stackTrace
          );
        } catch {
          /** Noop */
        }
      }
      throw error;
    }

    // Status 204
    if (!response) return undefined;

    let rawData: unknown;
    try {
      rawData = await response.json();
    } catch {
      throw new RestApiError(response.status, 'API Response is not JSON.');
    }

    try {
      return await schema.parse(rawData);
    } catch {
      throw new Error('API Response does not match schema');
    }
  }

  /**
   * Fetches data from API.
   * @throws RestApiError
   */
  async function get<TResponseSchema extends z.ZodTypeAny>(
    path: string,
    schema: TResponseSchema,
    searchParams: Record<string, string | number | undefined> = {},
    init?: RequestInit
  ) {
    const searchQuery = new URLSearchParams(
      R.compose(
        R.mapObjIndexed((value: string | number) => value.toString()),
        R.pickBy((value: string) => !R.isNil(value))
      )(searchParams)
    ).toString();
    return apiJsonRequest(
      `${path}${searchQuery ? `?${searchQuery}` : ''}`,
      schema,
      init
    );
  }

  /**
   * Sends POST request to API.
   * @throws RestApiError
   */
  async function post<
    TResponseSchema extends z.ZodTypeAny,
    TData extends Record<string, unknown> = Record<string, unknown>
  >(path: string, schema: TResponseSchema, data: TData, init?: RequestInit) {
    return apiJsonRequest(path, schema, {
      ...init,
      method: 'post',
      body: JSON.stringify(data)
    });
  }

  /**
   * Sends PUT request to API.
   * @throws RestApiError
   */
  async function put<
    TResponseSchema extends z.ZodTypeAny,
    TData extends Record<string, unknown> = Record<string, unknown>
  >(path: string, schema: TResponseSchema, data: TData, init?: RequestInit) {
    return apiJsonRequest(path, schema, {
      ...init,
      method: 'put',
      body: JSON.stringify(data)
    });
  }

  /**
   * Sends PATCH request to API.
   * @throws RestApiError
   */
  async function patch<
    TResponseSchema extends z.ZodTypeAny,
    TData extends object
  >(path: string, schema: TResponseSchema, data: TData, init?: RequestInit) {
    return apiJsonRequest(path, schema, {
      ...init,
      headers: {
        'Content-Type': 'application/json-patch+json',
        ...init?.headers
      },
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * Sends DELETE request to API.
   * @throws RestApiError
   */
  async function remove(path: string, init?: RequestInit) {
    return apiJsonRequest(path, z.unknown(), {
      ...init,
      method: 'delete'
    });
  }

  return {
    get,
    post,
    put,
    patch,
    remove
  };
}
