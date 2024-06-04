export function GET(request: Request) {
  return Response.json({
    supportedVersions: {
      android: '>=1.0.0',
      ios: '>=1.0.0'
    }
  });
}
