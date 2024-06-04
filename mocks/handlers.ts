import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/installerAppConfig', () => {
    return HttpResponse.json({
      supportedVersions: {
        android: '>=1.0.0',
        ios: '>=1.0.0'
      }
    });
  })
];
