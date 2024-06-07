import { z } from 'zod';
import { http, HttpResponse } from 'msw';
import { createRestApi } from './create-rest-api';
import { server } from '~/mocks/server';

describe('createRestApi', () => {
  const apiEndpoint = 'http://example.com/api';
  const api = createRestApi(apiEndpoint);

  describe('get', () => {
    it('should fetch data and return parsed JSON', async () => {
      const mockData = { id: 1, name: 'Test' };

      server.use(
        http.get(`${apiEndpoint}/test`, () => {
          return HttpResponse.json(mockData);
        })
      );
      const schema = z.object({ id: z.number(), name: z.string() });
      const result = await api.get('/test', schema);
      expect(result).toEqual(mockData);
    });

    it('should throw RestApiError when response is not JSON', async () => {
      server.use(
        http.get(`${apiEndpoint}/test`, () => {
          return HttpResponse.json(undefined);
        })
      );
      const schema = z.object({ id: z.number() });
      expect(api.get('/test', schema)).rejects.toThrow(
        'API Response is not JSON'
      );
    });
  });

  describe('post', () => {
    it('should send a POST request with data and return the response', async () => {
      const mockData = { success: true };
      server.use(
        http.post(`${apiEndpoint}/test`, () => {
          return HttpResponse.json(mockData);
        })
      );
      const schema = z.object({ success: z.boolean() });
      const data = { id: 1 };
      const result = await api.post('/test', schema, data);
      expect(result).toEqual(mockData);
    });
  });

  describe('put', () => {
    it('should send a PUT request with data', async () => {
      const mockData = { updated: true };
      server.use(
        http.put(`${apiEndpoint}/test`, () => {
          return HttpResponse.json(mockData);
        })
      );
      const schema = z.object({ updated: z.boolean() });
      const data = { name: 'New Name' };
      const result = await api.put('/test', schema, data);
      expect(result).toEqual(mockData);
    });
  });

  describe('patch', () => {
    it('should send a PATCH request with JSON patch content type', async () => {
      const mockData = { patched: true };
      server.use(
        http.patch(`${apiEndpoint}/test`, () => {
          return HttpResponse.json(mockData);
        })
      );
      const schema = z.object({ patched: z.boolean() });
      const data = { name: 'Patched Name' };
      const result = await api.patch('/test', schema, data);
      expect(result).toEqual(mockData);
    });
  });

  describe('remove', () => {
    it('should send a DELETE request', async () => {
      const mockData = { deleted: true };
      server.use(
        http.delete(`${apiEndpoint}/test`, () => {
          return HttpResponse.json(mockData);
        })
      );
      const result = await api.remove('/test');
      expect(result).toEqual(mockData);
    });
  });
});
