import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/installer-app-config', () => {
    return HttpResponse.json({
      supportedVersions: {
        android: '>=2.0.0',
        ios: '>=2.0.0'
      }
    });
  })
];
